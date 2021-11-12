import React, { useState, useCallback, useRef } from 'react';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { 
    setXlsxPassword, 
    setXlsxFileLocation, 
    setXlsxOriginal,
    clearXlsxPassword, 
    clearXlsxOriginal,
} from '../models/actions';
const { dialog } = window.remote;
const XlsxPopulate = window.xlsxPopulate;

// process.browser 為 undefined 才可使用 XlsxPopulate.fromFileAsync
process.browser = window.process_browser;

const convertSheetToJSON = (sheet, headerIndexMap) => {
    let maxRowNumber = sheet.usedRange()._maxRowNumber;
    let arr = [];
    // 從第 2 row 開始讀
    for (let i = 2; i <= maxRowNumber; i ++) {
        // 此 row
        let thisRow = sheet.row(i);
        // 判斷是否空白 row
        if (!thisRow.cell(1).value())
            break;
        else {
            let temp = {};
            for (const [key, value] of Object.entries(headerIndexMap)) {
                // 若無值則給空字串
                temp[key] = String(thisRow.cell(value).value() ?? '');
            }
            arr.push(temp);
        }
    }
    return arr;
}

const processXlsxContent = (workbook) => {
    // 預定義 metadata 工作表標頭
    let metadataHeaderIndexMap = { 
        apHeader: 1, 
        displayHeader: 2, 
        hide: 3, 
        mask: 4,
        filterPriority: 5
    };
    // 取得 metadata 陣列
    let metadata = convertSheetToJSON(workbook.sheet('metadata'), metadataHeaderIndexMap);
    // ap 工作表
    let apSheet = workbook.sheet('ap');
    // 取得最大 Column 數
    let maxColumnNumber = apSheet.usedRange()._maxColumnNumber;
    let apHeaderIndexMap = {};
    // 取得每個 ap 工作表中每個 header 對應的 index，1-based
    for (let i = 1; i <= maxColumnNumber; i ++) {
        let thisHeader = apSheet.row(1).cell(i).value();
        // 判斷是否為空字串 column header，若為空則表示結束
        if (!thisHeader || thisHeader === undefined)
            break;
        else {
            // 找尋於 metadata 中，是否存在此 header
            let index = metadata.findIndex((e) => e['apHeader'] === thisHeader);
            // 若存在，則記錄該 header 位於 ap 工作表的 column 位置
            if (index !== -1) {
                apHeaderIndexMap[thisHeader] = i;
            } 
        }
    }
    let ap = convertSheetToJSON(apSheet, apHeaderIndexMap);
    // 確定每個欄位是否隱藏或遮罩
    ap.forEach((e) => {
        e['__mask'] = [];
        e['__hide'] = [];
        metadata.forEach((_e) => {
            // 遮罩
            if (_e['mask'] !== '') e['__mask'].push(_e['apHeader'])
            // 隱藏
            if (_e['hide'] !== '') e['__hide'].push(_e['apHeader'])
        })
    });
    let content = {
        metadata: metadata,
        ap: ap
    };
    return content;
};

const XlsxReader = () => {
    const xlsxPassword = useSelector(state => state.xlsxFileInfo.password);
    const xlsxPath = useSelector(state => state.xlsxFileInfo.location);
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    const confirmBtn = useRef(null);
    const passwordInput = useRef(null);
    const alertTimeout = useRef(null);

    // 讀取 excel，宣告為 async 才能使用 await Promise，
    // 否則資料還沒抓到直接進行下一步處理就會出錯。
    const handleReadXlsx = useCallback(async (xlsxPath, xlsxPassword) => {
            try {
                let workbook = await XlsxPopulate.fromFileAsync(
                                    xlsxPath,               // xlsx 路徑
                                    { password: xlsxPassword }  // xlsx 密碼，若無密碼給空字串即可
                                )
                // 讀取成功
                setSuccess(true);
                // 清除密碼欄位
                passwordInput.current.value = '';
                dispatch(clearXlsxPassword());
                // 將 xlsx 整理為想要的格式
                let content = processXlsxContent(workbook);
                dispatch(setXlsxOriginal({
                    metadata: content['metadata'],
                    ap: content['ap'],
                }));
            } catch(e) {
                console.log(e)
                // 密碼有誤、檔案有誤等等的錯誤
                setSuccess(false);
                dispatch(clearXlsxOriginal());
            } finally {
                // 先移除先前設定的 timeout
                window.clearTimeout(alertTimeout.current);
                // 建立一個新的 timeout
                alertTimeout.current = setTimeout(() => setAlertVisible(false), 5000);
                // 顯示 Alert
                setAlertVisible(true);
            }
        }, [dispatch]);

    // 選擇檔案
    const handleChooseFile = useCallback(() => {
            dialog.showOpenDialog({
                properties: ['openFile'],   // 為開啟檔案對話框
                filters: [
                    { name: 'xlsx', extensions: ['xlsx'] }, // 只允許顯示 xlsx 結尾的檔案
                ],
            }).then((obj) => {
                // 取得路徑
                let filePath = obj.filePaths[0];
                dispatch(setXlsxFileLocation(filePath ? filePath : ''));
                setAlertVisible(false);
            });
        }, [dispatch]);

    const handleKeyDown = useCallback((e) => {
            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                confirmBtn.current.click();
            }
        }, []);
    return (
        <div>
            <Form.Group as={Row} className="mb-2" controlId="formFile">
                <Form.Label column sm="2">XLSX File</Form.Label>
                <Col sm="10">
                    <Button variant="outline-dark" onClick={() => handleChooseFile()}>
                        Choose File
                    </Button>{' '}
                    <Form.Text className="text-dark">
                        {xlsxPath}
                    </Form.Text>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2" controlId="formPassword">
                <Form.Label column sm="2">Password</Form.Label>
                <Col sm="10">
                    <Form.Control type="password" placeholder="Password" 
                        onChange={(e) => dispatch(setXlsxPassword(e.target.value))} 
                        onKeyDown={(e) => handleKeyDown(e)} 
                        ref={passwordInput}
                    />
                </Col>
            </Form.Group>
            { alertVisible && 
                <Alert variant={success ? 'success' : 'danger'} className="mb-2">
                    { success ? 
                        '檔案成功開啟 ' : 
                        xlsxPath === '' ? 
                            '請選擇檔案' : 
                            '請確認檔案或密碼是否正確，若無密碼則無須輸入密碼'
                    } ... 此提示將於 5 秒鐘後隱藏
                </Alert> 
            }
            <div className="d-grid">
                <Button variant="dark" className="mb-3"
                    onClick={() => handleReadXlsx(xlsxPath, xlsxPassword)} 
                    ref={confirmBtn}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
}

export default XlsxReader;

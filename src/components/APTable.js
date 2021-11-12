import React, { useState, useCallback, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import ActionIcon from './ActionIcon';
import { useSelector } from 'react-redux';

const clipboard = window.clipboard;

const APTable = () => {
    const [unmaskColumn, setUnmaskColumn] = useState({});
    const c = useSelector(state => state.xlsxContent.fromFilter);
    const [content, setContent] = useState({});

    // 當 props.content 的值變動時，需要更新 content state
    useEffect(() => {
        setContent(c);
    }, [c]);

    const handleMaskIconClick = useCallback((header) => {
            // 複製一個新的 unmaskColumn，否則等同直接修改 unmaskColumn，造成 React 不會更新畫面
            let unmaskColumn_copied = Object.assign({}, unmaskColumn);
            // 是否要 mask 
            unmaskColumn_copied[header] = !unmaskColumn[header];
            setUnmaskColumn(unmaskColumn_copied);

            // 複製一個新的 content，否則等同直接修改 content，造成 React 不會更新畫面
            let content_copied = Object.assign({}, content);
            // ap 物件中每個 mask array 皆跟著變化，存在 mask array 中的欄位表示要遮罩
            content_copied['ap'] = content_copied['ap'].map((e) => {
                let headerIndex = e['__mask'].findIndex(e => e === header);
                if (unmaskColumn_copied[header]) {
                    // 若原本是遮罩的，拿掉遮罩
                    if (headerIndex !== -1) e['__mask'].splice(headerIndex, 1);
                } else {
                    // 若原本不是遮罩的，加上遮罩
                    if (headerIndex === -1) e['__mask'].push(header);
                }
                return e;
            });
            setContent(content_copied);
        }, [unmaskColumn, content]);
    const handleDataDoubleClick = useCallback((index, header) => {
            // 複製一個新的 content，否則等同直接修改 content，造成 React 不會更新畫面
            let content_copied = Object.assign({}, content);
            
            // 被點擊的 ap 物件中，mask array 跟著變化，存在 mask array 中的欄位表示要遮罩
            let e = content_copied['ap'][index];
            let headerIndex = e['__mask'].findIndex((e) => e === header);
            if (headerIndex !== -1) e['__mask'].splice(headerIndex, 1);
            else if (headerIndex === -1) e['__mask'].push(header);

            setContent(content_copied);
        }, [content]);
    let ths = content['metadata'] && 
        // 先 filter 掉要隱藏的欄位
        content['metadata'].filter((e) => e['hide'] === '')
        .map((e) => { 
            return  (
                <th key={e['apHeader']} style={{ position: 'sticky', top: '-5px' }}>
                    {/* 若有遮罩需求，加上 icon */}
                    {e['mask'] !== '' && 
                        <FontAwesomeIcon 
                            icon={unmaskColumn[e['apHeader']] ? faEye : faEyeSlash} 
                            style={{cursor: 'pointer'}} 
                            onClick={() => handleMaskIconClick(e['apHeader'])}
                        />
                    }{' '}
                    {e['displayHeader']}
                </th>
            )
        });
    // 加上 Action icon 欄位
    ths && ths.push(<th key="__action" style={{ position: 'sticky', top: '-5px' }}>Action</th>)

    let tbodyTrs = content['ap'] && 
        content['ap'].map((e, i) => {
            // 先 filter 掉要隱藏的欄位，再設定 table body 每一個 row
            let tds = content['metadata'].filter((e) => e['hide'] === '')
                .map((_e) => {
                    let apHeader = _e['apHeader'];
                    let data = e[apHeader];
                    return  <td key={apHeader} 
                                // 若欄位可以被遮罩，且被左鍵雙擊
                                onDoubleClick={() => { _e['mask'] !== '' && handleDataDoubleClick(i, apHeader)}}
                                // 右鍵點擊代表複製該內容
                                onMouseUp={(e) => {if ( e.button === 2) clipboard.writeText(data)}}
                            >
                                {/* 處理遮罩，若該欄位可被遮罩，建立對應長度的字串，以 * 為遮罩符號 */}
                                {e['__mask'].includes(apHeader) ? Array(data.length + 1).join('*') : data}
                            </td>
                });
            // 加上動作 icon
            tds.push(<td key="action">
                        <ActionIcon info={{
                            protocol: e.protocol,
                            uri: e.uri,
                            account: e.account,
                            password: e.password,
                        }}/>
                    </td>)
            return <tr key={i}>{tds}</tr>
        });
    
    // 是否隱藏欄位
    let checkboxes = content['metadata'] && content['metadata'].map((e, i) => {
        return  <Form.Check key={e['apHeader']} inline 
                    type="checkbox" 
                    label={e['displayHeader']}
                    id={e['apHeader']} 
                    checked={e['hide'] === ''}
                    onClick={(e) => {
                    }}
                    onChange={(e) => {
                        let content_copied = Object.assign({}, content);
                        content_copied['metadata'][i]['hide'] = e.target.checked ? '' : '1';
                        setContent(content_copied);
                    }}
                />
    })
    return (
        <div>
            <Form.Group>
                {checkboxes}
            </Form.Group>
            <Table bordered hover size="sm">
                <thead className="table-dark text-nowrap">
                    <tr>
                        {ths}
                    </tr>
                </thead>
                <tbody>
                    {tbodyTrs}
                </tbody>
            </Table>
        </div>
    );
}

export default APTable;

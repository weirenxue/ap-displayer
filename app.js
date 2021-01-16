const rdp = require('node-rdp');
const { dialog } = require('electron').remote;
const XlsxPopulate = require('xlsx-populate');
const open = require('open'); 

function rdpConnect(uri, username, password, thenFun){
    rdp({
        address: uri,
        username: username,
        password: password
    }).then(thenFun);
}

// 抓取ap，宣告為async才能使用await Promise，
// 否則資料還沒抓到直接進行下一步處理就會出錯。
async function getAp(xlsxPath, password){
    let objs;
    let promise = XlsxPopulate.fromFileAsync(xlsxPath, { password: password });
    await promise.then(workbook => {
        objs = mapXlsxToJson(workbook.sheet(0));
    }).catch((error) => {
        // 密碼有誤
        objs = null;
    });
    return objs;
}


// xlsx改為json形式
function mapXlsxToJson(sheet) {
    let columnName = {};
    let objs = [];
    // 讀出所有標題名稱與行數，並加上'E'
    for (let i = 1; sheet.row(1).cell(i).value(); i++) {
        columnName[sheet.row(1).cell(i).value().trim() + 'E'] = i;
    }
    // 讀出所有資訊存在物件內，屬性名稱為標題名稱+'E'，例如：uriE。
    for (let i = 2; sheet.row(i).cell(columnName.uriE).value(); i++) {
        let obj = {};
        for (const [key, column] of Object.entries(columnName)) {
            obj[key] = String((sheet.row(i).cell(column).value() ?? '')).trim();
        }
        objs.push(obj);
    }
    return objs;
}
$(function(){
    $('#import-ap-xlsx').on('click', chooseFile);
    $('#confirm-import').on('click', handleFile);
    $('#xlsx-password').on('keypress', pressEnter);
    $('#select-sysNameE, #select-protocolE').on('change', selectFilterChanged);
    $('#keyword').on('keyup', keywordFilter);
});


let filePath = '';

// 限定選擇副檔名為xlsx的檔案
function chooseFile(){
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'xlsx', extensions: ['xlsx']},
        ],
    }).then((obj) => {
        filePath = obj.filePaths[0];
        if (!obj.filePaths[0]) {
            // 沒有選擇檔案
            $('#filename').text('');
            return;
        }
        $('#filename').text(obj.filePaths[0]);
    });
};

// 按enter等同按下確認鈕。
function pressEnter(e){
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        $('#confirm-import').trigger('click');
    }
}

let ap = null;
// 解析檔案，宣告為async function後可用await等待getAp。
async function handleFile(){
    let password = $('#xlsx-password').val();
    alertDiv = $('.alert');
    // 移除class為alert-*。
    alertDiv.removeClass('d-none').removeClass(function (index, className) {
        return (className.match (/\balert-\S+/g) || []).join(' ');
    });
    if (!filePath) {
        alertDiv.text('請先選擇檔案');
        alertDiv.addClass('alert-danger');
        return;
    }
    ap = await getAp(filePath, password);
    if (ap === null) {
        alertDiv.text('確認密碼是否正確，若無密碼則無須輸入密碼');
        alertDiv.addClass('alert-danger');
        return;
    }
    if (ap.length === 0) {
        alertDiv.text('無資料');
        alertDiv.addClass('alert-warning');
        return;
    }
    if (ap.length > 0) {
        alertDiv.text('檔案成功開啟');
        alertDiv.addClass('alert-success');
        $('#xlsx-password').val('');
    }
    fillSelect(ap);
    $('#select-sysNameE').trigger('change');
}

function fillTable(objs) {
    let trs = [];
    for (let obj in objs) {
        let ap = objs[obj];
        let tr = $(document.createElement('tr'));
        tr.attr('data-primarykey', ap['pkE']);
        tr.append($(document.createElement('td')).addClass('pkE').text(ap.pkE));
        tr.append($(document.createElement('td')).addClass('sysNameE').text(ap.sysNameE));
        tr.append($(document.createElement('td')).addClass('protocolE').text(ap.protocolE));
        tr.append($(document.createElement('td')).addClass('uriE').text(ap.uriE));
        tr.append($(document.createElement('td')).addClass('accountE').text(ap.accountE));
        tr.append($(document.createElement('td')).addClass('passwordE').append($('<input>').attr('type', 'password').attr('readonly', true).addClass('form-control-plaintext').val(ap.passwordE)));
        tr.append($(document.createElement('td')).addClass('descE').text(ap.descE));
        if (ap['protocolE'] === 'rdp') {
            tr.append($(document.createElement('td')).html('<div class="icon-bt p-rdp action-off"><i class="fas fa-desktop"></i></div>'));
        } else if (ap['protocolE'] === 'http' || ap['protocolE'] === 'https') {
            tr.append($(document.createElement('td')).html('<div class="icon-bt p-web"><i class="fas fa-globe"></i></div>'));
        } else if (ap['protocolE'] === 'mssql') {
            tr.append($(document.createElement('td')).html('<div class="icon-bt p-db"><i class="fas fa-database"></i></div>'));
        }
        trs.push(tr);
    }
    $('tbody', '#ap-table').empty().append(trs);
    actionReg();
}

function actionReg() {
    // 若為rdp，則開啟遠端。
    $('.p-rdp').on('click', function(){
        let pkE = $(this).parents('tr:first').data('primarykey');
        let thisAp = ap.find(e => e.pkE == pkE);
        iconBt = $('.p-rdp', $(this).parents('tr:first'));
        iconBt.removeClass('action-off').addClass('action-on');
        rdpConnect(thisAp.uriE, thisAp.accountE, thisAp.passwordE, function(){
            iconBt.removeClass('action-on').addClass('action-off');
        });
    });
    // 若為網頁應用，則開啟網頁。
    $('.p-web').on('click', function(){
        let pkE = $(this).parents('tr:first').data('primarykey');
        let thisAp = ap.find(e => e.pkE == pkE);
        oepnWeb(thisAp.uriE);
    });
}

function oepnWeb(url) {
    open(url);
}


function fillSelect(objs) {
    let protocolE = [];
    let sysNameE = [];
    for (let obj in objs) {
        let ap = objs[obj];
        sysNameE.push(ap.sysNameE);
        protocolE.push(ap.protocolE);
    }
    // 去除重複並排序。
    sysNameE = Array.from(new Set(sysNameE)).sort();
    protocolE = Array.from(new Set(protocolE)).sort();
    
    updateSysNameESelect(sysNameE, '#select-sysNameE');
    updateSysNameESelect(protocolE, '#select-protocolE');
}

function updateSysNameESelect(optionsValue, selectTag) {
    let optionsSet =  optionsValue;
    let options = [];
    options.push($(document.createElement('option')).val('all-value').attr('selected', true).text('全部'));
    for (let obj in optionsSet) {
        options.push($(document.createElement('option')).val(optionsSet[obj]).text(optionsSet[obj]));
    }
    $(selectTag).empty().append(options);
}

let filteredAp = [];
function selectFilterChanged(){
    filteredAp = ap.slice();
    let filterValue = '';
    filterValue = $('#select-sysNameE').val();
    if (filterValue !== 'all-value') {
        filteredAp = filteredAp.filter(e => e['sysNameE'] === filterValue);
    }
    filterValue = $('#select-protocolE').val();
    if (filterValue !== 'all-value') {
        filteredAp = filteredAp.filter(e => e['protocolE'] === filterValue);
    }
    keywordFilter();
}

function keywordFilter(){
    if (filteredAp.length === 0) {
        fillTable(filteredAp);
        return;
    }
    let keywordFilteredAp = filteredAp.slice();
    let content = $('#keyword').val();
    if (content) {
        let keywords = content.split(',');
        keywordFilteredAp = keywordFilteredAp.filter(e => {
            for (let index in keywords) {
                let keyword = keywords[index];
                if (e.uriE.includes(keyword))
                    return true;
                if (e.descE.includes(keyword))
                    return true;
            }
            return false;
        });
    }
    fillTable(keywordFilteredAp);
}


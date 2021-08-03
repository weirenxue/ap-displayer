window.process_browser = undefined; // 在 client 端為 true, server 端為 undefined
window.remote = require('electron').remote; // 開放 remote 接口
window.xlsxPopulate = require('xlsx-populate');
window.node_rdp = require('node-rdp');
window.open = require('open');
window.clipboard = require('electron').clipboard;
// window.require = require;
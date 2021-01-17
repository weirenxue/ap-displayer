const { app, BrowserWindow, Menu, Tray, globalShortcut } = require('electron');
const path = require('path');

let win = null;
function createWindow () {
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: path.join(__dirname, 'wrx512.ico'),
        closable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });

    win.loadFile('index.html');

    win.on('minimize', () => {
        win.hide();
    });

    win.on('close', (e) => {
        e.preventDefault();
        win.hide();
    });

    globalShortcut.register('CommandOrControl+R', function() {
        win.reload();
    });
    globalShortcut.register('CommandOrControl+E', function() {
        win.removeAllListeners('close');
        win.setClosable(true);
        win.close();
    })
    
    win.setMenu(null);

    createTray();
}
let appIcon = null;
function createTray() {
    appIcon = new Tray(path.join(__dirname, 'wrx512.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            click() {
                win.show();
            }
        },
        {type:'separator'}, // 分隔線
        {
            label: 'Reload',
            accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
            click() {
                win.reload();
                win.show();
            }
        },
        {
            label: 'Exit',
            accelerator: process.platform === 'darwin' ? 'Cmd+E' : 'Ctrl+E',
            click() {
                win.removeAllListeners('close');
                win.setClosable(true);
                win.close();
            }
        }
    ]);
    appIcon.on('click', function(e){
        if (win.isVisible()) {
            win.hide()
        } else {
            win.show()
        }
    });
    // 不等待雙擊，否則單擊反應速度很慢
    appIcon.setIgnoreDoubleClickEvents(true);
    appIcon.setToolTip('A/P Displayer');
    appIcon.setContextMenu(contextMenu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    console.log('window-all-closed')
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    console.log('activate');
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

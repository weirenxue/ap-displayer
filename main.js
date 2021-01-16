const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');

let win = null;
function createWindow () {
    win = new BrowserWindow({
        width: 1200,
        height: 1200,
        icon: path.join(__dirname, 'wrx512.ico'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });

    win.loadFile('index.html');

    win.on('minimize', () => {
        win.hide()
    });

    createTray();
}
let appIcon = null;
function createTray() {
    appIcon = new Tray(path.join(__dirname, 'wrx512.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '顯示',
            click() {
                win.show();
            }
        },
        {
            label: '離開',
            click() {
                win.removeAllListeners('close');
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

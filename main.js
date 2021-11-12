// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, Menu, Tray, globalShortcut } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true,   // 允許在 render process 使用 remote module
            contextIsolation: false,    // 讓在 preload 的定義可以傳遞到 web (React)
        }
    });

    if (isDev) {
        // 開發階段直接與 React 連線
        mainWindow.loadURL('http://localhost:3000/');
        // Open the DevTools.
        mainWindow.webContents.openDevTools()
    } else {
        // 產品階段直接讀取 React 打包好的
        mainWindow.loadFile('./build/index.html');
        mainWindow.setMenu(null);
        // mainWindow.webContents.openDevTools()
    }

    // 若按下關閉
    mainWindow.on('close', (e) => {
        const choice = dialog.showMessageBoxSync(null,
            {
                type: 'question',
                buttons: ['Just Hide', 'Quit'],
                title: 'Confirm',
                message: 'What do you want to do?',
            });
        if (choice === 0) { // 如果選了第一個按鈕 ('Just Hide')
            e.preventDefault();
            mainWindow.hide();
        }
    });

    globalShortcut.register('CommandOrControl+Shift+R', () => {
        mainWindow.reload();
    });
    /*
    globalShortcut.register('CommandOrControl+E', () => {
        mainWindow.removeAllListeners('close');
        mainWindow.setClosable(true);
        mainWindow.close();
    })
    */

    createTray(mainWindow);
    
    return mainWindow;
}

let mainWindow = null;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    // 第二個開啟的 app 都會被關閉
    app.quit();
} else {
    // 此時的 app 為第一次開啟的 app，讓第一次開啟的 app 監聽
    // 建立第二個視窗的事件，若觸發則呼叫第一次開啟的 app 已經建立的視窗出來，
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    })
    // Create myWindow, load the rest of the app, etc...
    app.whenReady().then(() => {
        mainWindow = createWindow()
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function createTray(win) {
    let appIcon = new Tray(path.join(__dirname, 'icon_s.png'));
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
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+R' : 'Ctrl+Shift+R',
            click() {
                win.reload();
                win.show();
            }
        },
        {
            label: 'Exit',
            // accelerator: process.platform === 'darwin' ? 'Cmd+E' : 'Ctrl+E',
            click() {
                // 先移除 close 事件，否則會跳出要隱藏或關閉的提示視窗
                win.removeAllListeners('close');
                win.close();
            }
        }
    ]);
    appIcon.on('click', () => { win.show() });
    // 不等待雙擊，否則單擊反應速度很慢
    appIcon.setIgnoreDoubleClickEvents(true);
    appIcon.setToolTip('A/P Displayer');
    appIcon.setContextMenu(contextMenu);
}
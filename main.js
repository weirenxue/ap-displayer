const { app, BrowserWindow, Menu, Tray, globalShortcut, dialog } = require('electron');
const path = require('path');
const ChildProcess = require('child_process')

if (handleSquirrelEvent()) {
    return;
}
function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':

            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            app.quit();
            return true;
    }
}
let win = null;
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            win.show();
            win.focus();
        }
    })
    // Create myWindow, load the rest of the app, etc...
    app.whenReady().then(createWindow);
}
function createWindow () {
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: path.join(__dirname, 'wrx512.ico'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });

    win.loadFile('index.html');

    win.on('minimize', () => {
    });

    win.on('close', (e) => {
        const choice = dialog.showMessageBoxSync(null,
            {
                type: 'question',
                buttons: ['Just Hide', 'Quit'],
                title: 'Confirm',
                message: 'What do you want to do?',
            });
        if (choice == 0) { // 如果選了第一個按鈕
            e.preventDefault();
            win.hide();
        }
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

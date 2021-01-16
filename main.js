const { app, BrowserWindow } = require('electron')

function createWindow () {
    const win = new BrowserWindow({
        width: 1200,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    console.log('window-all-closed')
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    console.log('activate')
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

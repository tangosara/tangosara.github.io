const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1100,
        minHeight: 700,
        backgroundColor: '#0c0c0e',
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    win.loadFile('index.html');
    win.once('ready-to-show', () => win.show());
}

Menu.setApplicationMenu(null);
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

import { app, ipcMain, BrowserWindow } from 'electron';
import { usb } from 'usb';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { registerIpcHandlers } from './ipc';

let appWin;

const createWindow = () => {
  appWin = new BrowserWindow({
    width: 1000,
    height: 800,
    title: "Angular and Electron XD 2",
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'), 
      contextIsolation: true,                      
      nodeIntegration: false,                      
      webSecurity: true,
    }
  });
  appWin.loadURL('http://localhost:4200');
  appWin.setMenu(null);
  appWin.webContents.openDevTools();
};

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(() => {
  // * Registrar todos los registerIpcHandlers.
  registerIpcHandlers();
});


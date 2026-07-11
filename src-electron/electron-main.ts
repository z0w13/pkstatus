import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'node:path';
import os from 'node:os';
import {
  registerQuasarRuntime,
  resolveElectronAssetsPath,
} from '#q-app/electron/main';

//eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { homepage } from '../package.json';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

async function createWindow() {
  /**
   * Initial window options
   */
  const mainWindow = new BrowserWindow({
    icon: resolveElectronAssetsPath('icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.join(import.meta.dirname, 'electron-preload.cjs'),
    },
  });

  if (import.meta.env.QUASAR_DEV) {
    await mainWindow.loadURL(import.meta.env.QUASAR_APP_URL);
  } else {
    await mainWindow.loadFile('index.html');
  }
}

void app.whenReady().then(async () => {
  await registerQuasarRuntime();
  void createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (platform !== 'darwin') {
      app.quit();
    }
  });
});

ipcMain.handle('PKStatusApi:openProjectPage', async () => {
  await shell.openExternal(homepage);
});
ipcMain.handle('PKStatusApi:openUrl', async (_, url: string) => {
  const urlObj = new URL(url);
  if (!['http:', 'https:'].includes(urlObj.protocol)) {
    return;
  }

  await shell.openExternal(url);
});

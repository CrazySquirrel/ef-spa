import {app, BrowserWindow, protocol} from 'electron';

import * as path from 'path';
import * as url from 'url';

declare const name: string;

let mainWindow: BrowserWindow;
let application: typeof app;

function onWindowAllClosed() {
  if (process.platform !== 'darwin') {
    application.quit();
  }
}

function onActive() {
  if (mainWindow === null) {
    onReady();
  }
}

function onClose() {
  mainWindow = null;
}

function onReady() {
  const PROTOCOL = 'file';

  protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {
    let requestUrl = request.url;

    if (requestUrl.endsWith('/')) {
      requestUrl += 'index.html';
    }

    requestUrl = requestUrl.substr(PROTOCOL.length + 1);

    requestUrl = path.join(__dirname, requestUrl);

    requestUrl = path.normalize(requestUrl);

    callback(requestUrl);
  });

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    minWidth: 320,
    minHeight: 320,

    show: false,

    title: name,
    icon: './favicon/android-chrome-512x512.png',

    titleBarStyle: 'hidden',

    webPreferences: {
      devTools: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(url.format({
    pathname: '/',
    protocol: PROTOCOL + ':',
    slashes: true,
  }));

  mainWindow.on('closed', onClose);
}

application = app;
application.on('window-all-closed', onWindowAllClosed);
application.on('activate', onActive);
application.on('ready', onReady);

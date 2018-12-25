// Import electron dependencies
import {app, BrowserWindow, protocol} from 'electron';

// Import path and url dependencies
import * as path from 'path';
import * as url from 'url';

// Declare project name variable
declare const name: string;

// Declare window and application variables
let mainWindow: BrowserWindow;
let application: typeof app;

// All window close event handler
function onWindowAllClosed() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    application.quit();
  }
}

// All active event handler
function onActive() {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    onReady();
  }
}

// Close event handler
function onClose() {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow = null;
}

// Ready event handler
function onReady() {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.

  // Define default file protocol
  const PROTOCOL = 'file';

  // Method for resolving static relative paths from file://
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

  // Create the browser window.
  // @see https://github.com/electron/electron/blob/master/docs/api/browser-window.md
  mainWindow = new BrowserWindow({
    // declare window sizes
    width: 800,
    height: 600,

    // declare window minimum sizes
    minWidth: 320,
    minHeight: 320,

    // hide window until it's ready
    show: false,

    // define title and icon
    title: name,
    icon: './favicon/android-chrome-512x512.png',

    // hide bar
    titleBarStyle: 'hidden',

    // define browser setting
    webPreferences: {
      // allow dev tools
      devTools: true,
    },
  });

  // Wait until window is ready and show it
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: '/',
    protocol: PROTOCOL + ':',
    slashes: true,
  }));

  // Emitted when the window is closed.
  mainWindow.on('closed', onClose);
}

application = app;

// Quit when all windows are closed.
application.on('window-all-closed', onWindowAllClosed);

// Emitted when app is active
application.on('activate', onActive);

// Emitted when app is ready
application.on('ready', onReady);

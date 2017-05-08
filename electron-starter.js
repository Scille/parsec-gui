const electron = require('electron')
// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const Tray = electron.Tray

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create an icon in an operating system's notification area.
  appIcon = new Tray(path.join(__dirname, '/public/favicon.png'))
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show PARSEC',
      click: function() {
        mainWindow.show();
      }
    },
    {
      label: 'Quit PARSEC',
      click:  function() {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  appIcon.setToolTip('PARSEC - GUI')
  appIcon.setTitle('PARSEC - GUI')
  appIcon.setContextMenu(contextMenu)

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, minWidth: 760, minHeight: 500})

  // Remove the menu bar.
  mainWindow.setMenu(null)

  // Load the index.html of the app.
  if (process.env.ELECTRON_DEV){
    mainWindow.loadURL('http://localhost:3000')
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }
  else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '/build/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  // Minimize/close window to system tray and restore window back from tray
  mainWindow.on('minimize', function(event) {
    event.preventDefault()
    mainWindow.hide()
  });
  mainWindow.on('close', function(event) {
    if(!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false;
  });


  ipcMain.on('create_file', function(event, name) {
    const notifier = require('node-notifier');
    notifier.notify({
      message: "File Importer",
      title: name + " was added into PARSEC forlder",
      sound: true,
      wait: false,
      icon : path.join(__dirname, '/public/favicon.png'),
    }, function(error, response) {
      console.log(response);
    });
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

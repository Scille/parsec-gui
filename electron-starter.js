const electron = require('electron')
// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const Tray = electron.Tray

const notifier = require('node-notifier');
const path = require('path')
const url = require('url')
const pjson = require('./package.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, minWidth: 760, minHeight: 500})

  // Create the application menu
  var menu = Menu.buildFromTemplate([
    {
      role: 'help',
      submenu: [
        {
          label: 'View Licence',
          click: function() {
            electron.shell.openExternal('https://github.com/Scille/parsec-gui/blob/master/LICENSE');
          }
        },
        {
          label: `Version ${pjson['version']}`,
          enabled: false
        },
        {
          type: 'separator'
        },
        {
          role: 'close'
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: function() {
            app.isQuiting = true;
            app.quit();
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  // Create an icon in an operating system's notification area.
  tray = new Tray(path.join(__dirname, '/public/favicon.png'))
  tray.setToolTip(pjson['name']);
  tray.on('click', () => {
    mainWindow.show()
  })

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
    mainWindow.webContents.openDevTools()
  }

  // Minimize/close window to system tray and restore window back from tray
  mainWindow.on('minimize', function(event) {
    event.preventDefault()
    mainWindow.hide()
  })
  mainWindow.on('close', function(event) {
    if(!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false;
  })

  // Show Notifications
  ipcMain.on('create_file', function(event, name) {
    notifier.notify({
      message: name + " was added in your PARSEC forlder.",
      title: name + " added",
      sound: true,
      wait: false,
      icon : path.join(__dirname, '/public/favicon.png'),
    }, function(error, response) {
      console.log(response);
    });
  })
  ipcMain.on('update_file', function(event, name, newName) {
    notifier.notify({
      message: name + " is renamed to " + newName,
      title: name + " updated",
      sound: true,
      wait: false,
      icon : path.join(__dirname, '/public/favicon.png'),
    }, function(error, response) {
      console.log(response);
    });
  })
  ipcMain.on('delete_file', function(event, name) {
    notifier.notify({
      message: name + " was removed from your PARSEC forlder.",
      title: name + " deleted",
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

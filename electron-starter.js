const electron = require('electron')
// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const Tray = electron.Tray

const notifier = require('node-notifier')
const path = require('path')
const url = require('url')
const pjson = require('./package.json')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, minWidth: 760, minHeight: 500 })

  // Create the application menu
  var menu = Menu.buildFromTemplate([
    {
      role: 'help',
      submenu: [
        {
          label: 'View Licence',
          click: () => electron.shell.openExternal('https://github.com/Scille/parsec-gui/blob/master/LICENSE')
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
          click: () => {
            app.isQuiting = true
            app.quit()
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  // Create an icon in an operating system's notification area.
  tray = new Tray(path.join(__dirname, '/public/favicon.png'))
  tray.setToolTip(pjson['name'])
  tray.on('click', () => mainWindow.show())

  // Load the index.html of the app.
  if(process.env.ELECTRON_DEV) {
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
  mainWindow.on('minimize', (event) => {
    event.preventDefault()
    mainWindow.hide()
  })
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  // Show Notifications
  const sendNotification = (title, message) => {
    notifier.notify({
      title: title,
      message: message,
      sound: true,
      wait: false,
      icon : path.join(__dirname, '/public/favicon.png'),
    }, (error, response) => console.log(response))
  }
  ipcMain.on('create_file', (event, name) => {
    const title = `'${name}' added`
    const message = `'${name}' was added in your PARSEC forlder.`
    sendNotification(title, message)
  })
  ipcMain.on('update_file', (event, name, newName) => {
    const title = `'${name}' updated`
    const message = `'${name}' is renamed to '${newName}'.`
    sendNotification(title, message)
  })
  ipcMain.on('delete_file', (event, name) => {
    const title = `'${name}' deleted`
    const message = `'${name}' was removed from your PARSEC forlder.`
    sendNotification(title, message)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if(process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if(mainWindow === null) {
    createWindow()
  }
})

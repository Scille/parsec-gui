const electron = require('electron')
// Module to control application life.
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const Tray = electron.Tray

const path = require('path')
const url = require('url')
const pjson = require('./package.json')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, minWidth: 760, minHeight: 600, icon: path.join(__dirname, '/public/favicon.png') })

  // Create the application menu
  const template = [
    {
      label: 'View',
      submenu: [
        { role: 'togglefullscreen' },
        {
          label: 'Developer',
          submenu: [
            {
              label: 'Reload',
              accelerator: 'CmdOrCtrl+R',
              click: (item, focusedWindow) => { if(focusedWindow) focusedWindow.reload() }
            },
            {
              label: 'Toggle Developer Tools',
              accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
              click: (item, focusedWindow) => { if(focusedWindow) focusedWindow.webContents.toggleDevTools() }
            }
          ]
        },
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
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
        { type: 'separator' },
        {
          label: 'Documentation',
          click: () => electron.shell.openExternal('www.parsec.io')
        },
        { type: 'separator' },
        {
          label: 'Repport Issue',
          click: () => electron.shell.openExternal('https://github.com/Scille/parsec-gui/blob/master/CONTRIBUTING.rst')
        },
        {
          label: 'Search Issues',
          click: () => electron.shell.openExternal('https://github.com/Scille/parsec-gui/issues')
        },
      ]
    }
  ]
  if (process.platform === 'darwin') {
    template.unshift({
      label: pjson['name'],
      submenu: [
        { role: 'about' },
        {
          label: 'View Licence',
          click: () => electron.shell.openExternal('https://github.com/Scille/parsec-gui/blob/master/LICENSE')
        },
        {
          label: `Version ${pjson['version']}`,
          enabled: false
        },
        { type: 'separator' },
        {
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Cmd+Q',
          click: () => {
            app.isQuiting = true
            app.quit()
          }
        }
      ]
    })
    // Window menu.
    template[2].submenu = [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Zoom',
        role: 'zoom'
      }
    ]
    // Help menu.
    template[3].submenu.splice(0, 3)
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Create an icon in an operating system's notification area.
  if(process.platform !== 'darwin') {
    tray = new Tray(path.join(__dirname, '/public/favicon.png'))
    const trayMenu = Menu.buildFromTemplate([
      {
        label: pjson['name'],
        enabled: false
      },
      {
        label: 'Open',
        click: () => mainWindow.show()
      },
      {
        label: 'Quit',
        click: () => {
          app.isQuiting = true
          app.quit()
        }
      }
    ])
    tray.setToolTip(pjson['name'])
    tray.setContextMenu(trayMenu)
  }

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
  if(mainWindow === null) createWindow()
  else mainWindow.show()
})

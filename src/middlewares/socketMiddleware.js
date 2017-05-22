import * as types from '../actions/ActionTypes'
import * as actionsCreators from '../actions/ActionCreators'

const SOCKET_PATH = '/tmp/parsec'

const REQUESTS = Object.freeze({
  USER_MANIFEST_CREATE_FILE: 'USER_MANIFEST_CREATE_FILE',
  USER_MANIFEST_RENAME_FILE: 'USER_MANIFEST_RENAME_FILE',
  USER_MANIFEST_DELETE_FILE: 'USER_MANIFEST_DELETE_FILE',
  USER_MANIFEST_LIST_DIR: 'USER_MANIFEST_LIST_DIR',
  USER_MANIFEST_MAKE_DIR: 'USER_MANIFEST_MAKE_DIR',
  USER_MANIFEST_REMOVE_DIR: 'USER_MANIFEST_REMOVE_DIR',
  USER_MANIFEST_SHOW_DUSTBIN: 'USER_MANIFEST_SHOW_DUSTBIN',
  USER_MANIFEST_RESTORE: 'USER_MANIFEST_RESTORE',
  USER_MANIFEST_HISTORY: 'USER_MANIFEST_HISTORY',
  FILE_STAT: 'FILE_STAT'
})

const socketMiddleware = (() => {
  let socket = null
  const electron = window.require('electron')
  const net = electron.remote.require('net')
  const ipcRenderer  = electron.ipcRenderer

  const onData = (store, data) => {
    data.split('\n').filter(item => item !== '').forEach((data) => {
      data = JSON.parse(data)
      if(data.status === 'ok' && data.hasOwnProperty('request_id')) {
        const [id, ...rest] = data.request_id.split(':')
        switch(id) {
          case REQUESTS.USER_MANIFEST_LIST_DIR:
            let files = []
            for(let [key, value] of Object.entries(data['children'])) {
              files.push({
                ...value,
                name: key,
                path: rest[0] === '/' ? rest[0].concat(key) : rest[0].concat('/', key),
              })
            }
            store.dispatch(actionsCreators.refreshFiles(files))
            files.forEach((file) => socket.write(`{"cmd": "file_stat", "request_id": "${REQUESTS.FILE_STAT}", "id": "${file.id}"}\n`))
            break
          case REQUESTS.USER_MANIFEST_SHOW_DUSTBIN:
            let dustbin = []
            data['dustbin'].forEach((file) => dustbin.push({
              ...file,
              name: file.path.split('/').pop()
            }))
            store.dispatch(actionsCreators.refreshFiles(dustbin))
            break
          case REQUESTS.FILE_STAT:
            store.dispatch(actionsCreators.updateFile(data))
            break
          case REQUESTS.USER_MANIFEST_CREATE_FILE:
          case REQUESTS.USER_MANIFEST_MAKE_DIR:
          case REQUESTS.USER_MANIFEST_RESTORE:
            ipcRenderer.send('add_file', rest[0])
            break
          case REQUESTS.USER_MANIFEST_RENAME_FILE:
            ipcRenderer.send('update_file', rest[0], rest[1])
            break
          case REQUESTS.USER_MANIFEST_DELETE_FILE:
          case REQUESTS.USER_MANIFEST_REMOVE_DIR:
            ipcRenderer.send('delete_file', rest[0], rest[1])
            break
          default:
            break
        }
      }
    })
  }

  return store => next => action => {
    switch(action.type) {
      case types.SOCKET_CONNECT:
        if(socket != null) socket.end()
        socket = new net.Socket()
        socket.on("error", (error) => {
          window.location.hash = '/socket-error'
          ipcRenderer.send('catch_error', error.message)
        })
        socket.on("data", (data) => onData(store, data))
        socket.connect({path: SOCKET_PATH}, () => {
          socket.setEncoding('utf8')
          socket.write(`{"cmd": "identity_load", "identity": null}\n`)
          socket.write(`{"cmd": "user_manifest_load"}\n`)
          if(action.cmd === 'list_dir') {
            socket.write(`{"cmd": "user_manifest_list_dir", "request_id": "${REQUESTS.USER_MANIFEST_LIST_DIR}:/", "path": "/"}\n`)
          }
          else if (action.cmd === 'show_dustbin') {
            socket.write(`{"cmd": "user_manifest_show_dustbin", "request_id": "${REQUESTS.USER_MANIFEST_SHOW_DUSTBIN}"}\n`)
          }
        })
        break
      case types.SOCKET_END:
        if(socket != null) socket.end()
        socket = null
        break
      case types.SOCKET_LIST_DIR:
        socket.write(`{"cmd": "user_manifest_list_dir", "request_id": "${REQUESTS.USER_MANIFEST_LIST_DIR}:${action.route}", "path": "${action.route}"}\n`)
        break;
      case types.SOCKET_SHOW_DUSTBIN:
        socket.write(`{"cmd": "user_manifest_show_dustbin", "request_id": "${REQUESTS.USER_MANIFEST_SHOW_DUSTBIN}"}\n`)
        break;
      case types.SOCKET_CREATE_FILE:
        const reader = new FileReader()
        reader.readAsDataURL(action.file)
        reader.onload = () => {
          socket.write(`{"cmd": "user_manifest_create_file", "request_id": "${REQUESTS.USER_MANIFEST_CREATE_FILE}:${action.route}", "path": "${action.route}", "content": "${reader.result.split(',')[1]}"}\n`)
        }
        reader.onerror = (evt) => alert("Error reading file")
        break
      case types.SOCKET_RENAME_FILE:
        socket.write(`{"cmd": "user_manifest_rename_file", "request_id": "${REQUESTS.USER_MANIFEST_RENAME_FILE}:${action.actualRoute}:${action.newRoute}", "old_path": "${action.actualRoute}", "new_path": "${action.newRoute}"}\n`)
        break
      case types.SOCKET_DELETE_FILE:
        socket.write(`{"cmd": "user_manifest_delete_file", "request_id": "${REQUESTS.USER_MANIFEST_DELETE_FILE}:${action.route}", "path": "${action.route}"}\n`)
        break
      case types.SOCKET_RESTORE_FILE:
        socket.write(`{"cmd": "user_manifest_restore", "request_id": "${REQUESTS.USER_MANIFEST_RESTORE}:${action.route}", "vlob": "${action.id}"}\n`)
        break
      case types.SOCKET_CREATE_DIR:
        socket.write(`{"cmd": "user_manifest_make_dir", "request_id": "${REQUESTS.USER_MANIFEST_MAKE_DIR}:${action.route}", "path": "${action.route}"}\n`)
        break
      case types.SOCKET_REMOVE_DIR:
        socket.write(`{"cmd": "user_manifest_remove_dir", "request_id": "${REQUESTS.USER_MANIFEST_REMOVE_DIR}:${action.route}", "path": "${action.route}"}\n`)
        break
      default:
        return next(action)
    }
  }
})()

export default socketMiddleware

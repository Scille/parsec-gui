import * as types from '../actions/actionTypes'
import * as actionsCreators from '../actions/actionCreators'

const SOCKET_PATH = '/tmp/parsec'

const REQUESTS = Object.freeze({
  IDENTITY_LOAD: 'IDENTITY_LOAD',
  USER_MANIFEST_CREATE_FILE: 'USER_MANIFEST_CREATE_FILE',
  USER_MANIFEST_RENAME_FILE: 'USER_MANIFEST_RENAME_FILE',
  USER_MANIFEST_DELETE_FILE: 'USER_MANIFEST_DELETE_FILE',
  USER_MANIFEST_LIST_DIR: 'USER_MANIFEST_LIST_DIR',
  USER_MANIFEST_MAKE_DIR: 'USER_MANIFEST_MAKE_DIR',
  USER_MANIFEST_REMOVE_DIR: 'USER_MANIFEST_REMOVE_DIR',
  USER_MANIFEST_SHOW_DUSTBIN: 'USER_MANIFEST_SHOW_DUSTBIN',
  USER_MANIFEST_RESTORE: 'USER_MANIFEST_RESTORE',
  USER_MANIFEST_HISTORY: 'USER_MANIFEST_HISTORY',
  USER_MANIFEST_LOAD: 'USER_MANIFEST_LOAD',
  FILE_STAT: 'FILE_STAT'
})

const socketMiddleware = (() => {
  let socket = null
  const electron = window.require('electron')
  const net = electron.remote.require('net')
  const ipcRenderer  = electron.ipcRenderer

  const onData = (store, data) => {
    console.log("*** SOCKET: data ***");
    for (var elt of data.split('\n').filter(item => item !== '')) {
      data = JSON.parse(elt);
      if (data['status'] === 'ok') {
        switch(data['request_id']) {
          case REQUESTS.USER_MANIFEST_LIST_DIR:
            var files = [];
            for (var key of Object.keys(data['children'])){
              files.push({
                id: data['children'][key]['id'],
                name: key,
                size: 0
              });
            }
            store.dispatch(actionsCreators.refreshFiles(files));
            for (var file of files) {
              socket.write(`{"cmd": "file_stat", "request_id": "${REQUESTS.FILE_STAT}", "id": "${file['id']}"}\n`)
            }
            break;
          case REQUESTS.FILE_STAT:
            var file_stat = {
              size: data['size']
            }
            store.dispatch(actionsCreators.updateFile(data['id'], file_stat));
            break;
          case REQUESTS.USER_MANIFEST_CREATE_FILE:
          case REQUESTS.USER_MANIFEST_RENAME_FILE:
          case REQUESTS.USER_MANIFEST_MAKE_DIR:
          case REQUESTS.IDENTITY_LOAD:
          case REQUESTS.USER_MANIFEST_LOAD:
          default:
            break
        }
      }
    }
  }

  return store => next => action => {
    switch(action.type) {
      case types.SOCKET_CONNECT:
        console.log("*** SOCKET: Connect ***")
        if(socket != null) socket.end()
        socket = new net.Socket()
        socket.on("error", (error) => ipcRenderer.send('catch_error', error.message))
        socket.on("data", (data) => onData(store, data))
        socket.connect({path: SOCKET_PATH}, () => {
          socket.setEncoding('utf8')
          socket.write(`{"cmd": "identity_load", "request_id": "${REQUESTS.IDENTITY_LOAD}", "identity": "null"}\n`)
          socket.write(`{"cmd": "user_manifest_load", "request_id": "${REQUESTS.USER_MANIFEST_LOAD}"}\n`)
          socket.write(`{"cmd": "user_manifest_list_dir", "request_id": "${REQUESTS.USER_MANIFEST_LIST_DIR}", "path": "/"}\n`)
        })
        break
      case types.SOCKET_END:
        console.log("*** SOCKET: End ***")
        if(socket != null) socket.end()
        socket = null
        break
      case types.SOCKET_LIST_DIR:
        socket.write(`{"cmd": "user_manifest_list_dir", "request_id": "${REQUESTS.USER_MANIFEST_LIST_DIR}", "path": "${action.route}"}\n`)
        break;
      case types.SOCKET_SHOW_DUSTBIN:
        socket.write(`{"cmd": "user_manifest_show_dustbin", "request_id": "${REQUESTS.USER_MANIFEST_SHOW_DUSTBIN}", "path": "${action.route}"}\n`)
        break;
      case types.SOCKET_CREATE_FILE:
        const reader = new FileReader()
        reader.readAsDataURL(action.file)
        reader.onload = () => {
          socket.write(`{"cmd": "user_manifest_create_file", "request_id": "${REQUESTS.USER_MANIFEST_CREATE_FILE}", "path": "${action.route}", "content": "${reader.result.split(',')[1]}"}\n`)
          ipcRenderer.send('create_file', action.route);
        }
        reader.onerror = (evt) => alert("Error reading file")
        break
      case types.SOCKET_RENAME_FILE:
        socket.write(`{"cmd": "user_manifest_rename_file", "request_id": "${REQUESTS.USER_MANIFEST_RENAME_FILE}", "old_path": "${action.actualRoute}", "new_path": "${action.newRoute}"}\n`)
        ipcRenderer.send('update_file', action.actualRoute, action.newRoute)
        break
      case types.SOCKET_CREATE_DIR:
        socket.write(`{"cmd": "user_manifest_make_dir", "request_id": "${REQUESTS.USER_MANIFEST_MAKE_DIR}", "path": "${action.route}"}\n`)
        ipcRenderer.send('create_file', action.route)
        break
      default:
        return next(action)
    }
  }
})()

export default socketMiddleware

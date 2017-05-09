import * as types from '../actions/actionTypes';
import * as actionsCreators from '../actions/actionCreators';

const SOCKET_PATH = '/tmp/parsec';

const REQUESTS = Object.freeze({
  "IDENTITY_LOAD": "0",
  "USER_MANIFEST_LOAD": "1",
  "USER_MANIFEST_LIST_DIR": "2",
  "USER_MANIFEST_CREATE_FILE": "3",
  "USER_MANIFEST_RENAME_FILE": "4",
  "USER_MANIFEST_MAKE_DIR": "5",
  "FILE_STAT": "6",
});

const socketMiddleware = (() => {
  var socket = null;
  const electron = window.require('electron');
  const net = electron.remote.require('net');
  const ipcRenderer  = electron.ipcRenderer;

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
              socket.write(`{"cmd": "file_stat", "request_id": "${REQUESTS.FILE_STAT}", "id": "${file['id']}"}\n`);
            }
            break;
          case REQUESTS.USER_MANIFEST_CREATE_FILE:
            var createFile = {
              id: data['id'],
            }
            store.dispatch(actionsCreators.updateFile('-1', createFile));
            socket.write(`{"cmd": "file_stat", "request_id": "${REQUESTS.FILE_STAT}", "id": "${data['id']}"}\n`);
            break;
          case REQUESTS.FILE_STAT:
            var file_stat = {
              size: data['size']
            }
            store.dispatch(actionsCreators.updateFile(data['id'], file_stat));
            break;
          case REQUESTS.USER_MANIFEST_RENAME_FILE:
          case REQUESTS.USER_MANIFEST_MAKE_DIR:
          case REQUESTS.IDENTITY_LOAD:
          case REQUESTS.USER_MANIFEST_LOAD:
          default:
            break;
        }
      }
    }
  }

  return store => next => action => {
    switch(action.type) {
      case types.SOCKET_CONNECT:
        console.log("*** SOCKET: Connect ***");
        if(socket != null) socket.end();
        socket = net.connect({path: SOCKET_PATH});
        socket.setEncoding('utf8');
        socket.write(`{"cmd": "identity_load", "request_id": "${REQUESTS.IDENTITY_LOAD}", "identity": "null"}\n`);
        socket.write(`{"cmd": "user_manifest_load", "request_id": "${REQUESTS.USER_MANIFEST_LOAD}"}\n`);
        socket.write(`{"cmd": "user_manifest_list_dir", "request_id": "${REQUESTS.USER_MANIFEST_LIST_DIR}", "path": "/"}\n`);
        socket.on("data", (data) => onData(store, data));
        break;
      case types.SOCKET_END:
        console.log("*** SOCKET: End ***");
        if(socket != null) socket.end();
        socket = null;
        break;
      case types.SOCKET_LIST_DIR:
        const listPath = action.path === '' ? '/' : action.path;
        socket.write(`{"cmd": "user_manifest_list_dir", "request_id": "${REQUESTS.USER_MANIFEST_LIST_DIR}", "path": "${listPath}"}\n`);
        break;
      case types.SOCKET_CREATE_FILE:
        const createFilePath = action.path === '' ? '/' : action.path;
        const reader = new FileReader();
        reader.readAsDataURL(action.file);
        reader.onload = () => {
          const file = {
            id: "-1",
            name: action.path.split('/').pop(),
            size: 0
          }
          store.dispatch(actionsCreators.addFile(file));
          socket.write(`{"cmd": "user_manifest_create_file", "request_id": "${REQUESTS.USER_MANIFEST_CREATE_FILE}", "path": "${createFilePath}", "content": "${reader.result.split(',')[1]}"}\n`);
          ipcRenderer.send('create_file', file['name']);
        }
        reader.onerror = (evt) => {
          alert("Error reading file");
        }
        break;
      case types.SOCKET_RENAME_FILE:
        const renameFilePath = action.path === '' ? '/' : action.path;
        const oldFilePath = renameFilePath.concat(action.name)
        const newFilePath = renameFilePath.concat(action.newName)
        socket.write(`{"cmd": "user_manifest_rename_file", "request_id": "${REQUESTS.USER_MANIFEST_RENAME_FILE}", "old_path": "${oldFilePath}", "new_path": "${newFilePath}"}\n`);
        socket.write(`{"cmd": "user_manifest_list_dir", "request_id": "${REQUESTS.USER_MANIFEST_LIST_DIR}", "path": "${renameFilePath}"}\n`);
        ipcRenderer.send('update_file', action.name, action.newName);
        break;
      case types.SOCKET_CREATE_DIR:
        const dirPath = action.path === '' ? '/' : action.path;
        const newDirPath = dirPath.concat(action.name);
        socket.write(`{"cmd": "user_manifest_make_dir", "request_id": "${REQUESTS.USER_MANIFEST_MAKE_DIR}", "path": "${newDirPath}"}\n`);
        socket.write(`{"cmd": "user_manifest_list_dir", "request_id": "${REQUESTS.USER_MANIFEST_LIST_DIR}", "path": "${dirPath}"}\n`);
        ipcRenderer.send('create_file', action.name);
        break;
      default:
        return next(action);
    }
  }
})();

export default socketMiddleware;

import * as types from '../actions/actionTypes';
import * as actionsCreators from '../actions/actionCreators';

const SOCKET_PATH = '/tmp/parsec';

const REQUESTS = Object.freeze({
  "IDENTITY_LOAD": "0",
  "USER_MANIFEST_LOAD": "1",
  "USER_MANIFEST_LIST_DIR": "2,"
});

const socketMiddleware = (() => {
  var socket = null;
  const electron = window.require('electron');
  const net = electron.remote.require('net');

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
                detail: 'todo'
              });
            }
            store.dispatch(actionsCreators.refreshFiles(files));
            break;
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
        if(socket != null) {
          socket.end();
        }
        socket = net.connect({path: SOCKET_PATH});
        socket.setEncoding('utf8');
        socket.write(`{"cmd": "identity_load", "request_id": "${REQUESTS.IDENTITY_LOAD}", "identity": "null"}\n`);
        socket.write(`{"cmd": "user_manifest_load", "request_id": "${REQUESTS.USER_MANIFEST_LOAD}"}\n`);
        socket.on("data", (data) => onData(store, data));
        break;
      case types.SOCKET_END:
        console.log("*** SOCKET: End ***");
        if(socket != null) {
          socket.end();
        }
        socket = null;
        break;
      case types.SOCKET_LIST_DIR:
        const path = action.path === '' ? '/' : action.path;
        socket.write(`{"cmd": "user_manifest_list_dir", "request_id": "${REQUESTS.USER_MANIFEST_LIST_DIR}", "path": "${path}"}\n`);
        break;
      default:
        return next(action);
    }
  }
})();

export default socketMiddleware;

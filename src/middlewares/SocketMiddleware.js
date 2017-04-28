import * as types from '../actions/actionTypes';

const socketMiddleware = (() => {
  var socket = null;
  const electron = window.require('electron');
  const net = electron.remote.require('net');
  const socketPath = "/tmp/parsec";

  const onData = (data) => {
    console.log("*** SOCKET: data ***");
    console.log(data);
    for (var elt of data.split('\n').slice(0,-1)){
      data = JSON.parse(elt);
      if (data['status'] === 'ok' && 'children' in data) {
        var files = [];
        for (var key of Object.keys(data['children'])){
          data['children'][key]['name'] = key;
          files.push(data['children'][key]);
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
        socket = net.connect({path: socketPath});
        socket.setEncoding('utf8');
        socket.write('{"cmd": "identity_load", "identity": null}\n');
        socket.write('{"cmd": "user_manifest_load"}\n');
        socket.on("data", onData);
        break;
      case types.SOCKET_END:
        if(socket != null) {
          socket.end();
        }
        socket = null;
        break;
      case types.REFRESH_FILES:
        socket.write(`{"cmd": "user_manifest_list_dir", "path": "${action.path}"}\n`);
        break;
      default:
        return next(action);
    }
  }
})();

export default socketMiddleware;

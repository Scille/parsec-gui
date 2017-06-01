import NotifyApi from './notifyApi'

class SocketApi {
  static connect(path='/tmp/parsec') {
    const electron = window.require('electron')
    const net = electron.remote.require('net')

    if(this._socket != null) this._socket.end()
    this._socket = new net.Socket()
    this._socket.on("error", (error) => {
      window.location.hash = '/socket-error'
      NotifyApi.notify('Error', error.message)
    })
    this._socket.connect({ path }, () => {
      SocketApi.write(`{"cmd": "identity_load", "identity": null}\n`).then(
        () => SocketApi.write(`{"cmd": "user_manifest_load"}\n`)
      )
    })
  }

  static end() {
    if(this._socket != null) this._socket.end()
    this._socket = null
  }

  static write(cmd) {
    return new Promise((resolve, reject) => {
      this._socket.write(cmd, 'utf8', () => {
        this._socket.once("data", (data) => {
          data = JSON.parse(data)
          data.status === 'ok' ? resolve(data) : reject(data)
        })
      })
    })
  }
}

export default SocketApi

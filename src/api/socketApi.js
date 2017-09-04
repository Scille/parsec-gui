import NotifyApi from '../api/notifyApi'

class SocketApi {
  static connect(path='/tmp/parsec') {
    return new Promise((resolve, reject) => {
      const electron = window.require('electron')
      const net = electron.remote.require('net')

      if(this._socket != null) this._socket.end()
      this._socket = new net.Socket()
      this._socket.on("error", (error) => reject(error))

      this._socket.connect({ path }, () => {
        this._socket.setEncoding('utf8')
        this._socket.on("close", (error) => {
          window.location.hash = '/socket-error'
          NotifyApi.notify('Error', `Socket is fully closed (${path})`)
        })
        resolve({ status: 'ok' })
      })
    })
  }

  static end() {
    if(this._socket != null) this._socket.end()
    this._socket = null
  }

  static write(cmd) {
    return new Promise((resolve, reject) => {
      this._socket.once("data", (data) => {
        data = JSON.parse(data)
        setTimeout(() => data.status === 'ok' ? resolve(data) : reject(data), 100)
      })
      this._socket.write(cmd)
    })
  }
}

export default SocketApi

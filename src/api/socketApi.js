const WaitQueue = require('wait-queue-es5')
import NotifyApi from '../api/notifyApi'

class SocketApi {

  static connect(ip='127.0.0.1', port=6776) {
    return new Promise((resolve, reject) => {
      const electron = window.require('electron')
      const net = electron.remote.require('net')

      if(this._socket != null) this._socket.end()
      this._socket = new net.Socket()
      this._socket.on("error", (error) => reject(error))

      this.queue = new WaitQueue()
      var full_data = ''
      this._socket.on("data", (data) => {
        full_data += data
        if(String(data.slice(-1)) === '\n') {
          var responses = full_data.split('\n')
          for (var i = 0; i < responses.length - 1; i++) {
            this.queue.push(JSON.parse(responses[i]))
          }
          full_data = ''
        }
      })

      this._socket.connect({ ip, port }, () => {
        this._socket.setEncoding('utf8')
        this._socket.on("close", (error) => {
          window.location.hash = '/socket-error'
          NotifyApi.notify('Error', `Socket is fully closed (${ip}:${port})`)
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
      this._socket.write(cmd)
      this.queue.shift((error, response) => {
        setTimeout(() => response.status === 'ok' ? resolve(response) : reject(response), 100)
      })
    })
  }
}

export default SocketApi

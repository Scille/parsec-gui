class NotifyApi {
  static notify(title, message) {
    const path = require('path')
    const options = {
      body: message,
      icon: path.join(__dirname, '/favicon.png'),
      tag: 'soManyNotification'
    }
    if(!window.Notification) {
      alert("This browser does not support system notifications")
    }
    else if(Notification.permission === "granted") {
      const n = new Notification(title, options)
      setTimeout(() => n.close(n), 2000)
    }
    else if(Notification.permission !== 'denied') {
      Notification.requestPermission((permission) => {
        if(permission === "granted") {
          const n = new Notification(title, options)
          setTimeout(() => n.close(n), 2000)
        }
      })
    }
  }
}

export default NotifyApi

import NotifyApi from '../api/notifyApi'
import React, { Component } from 'react'

import './Login.css'

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = { type: 'device', device: '', user: '', password: '', password2: '', token: '', pairing_message: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfigure = this.handleConfigure.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.checkPairing = this.checkPairing.bind(this)
  }

  componentDidMount() {
    this.props.dispatch.init()
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({ [name]: value })
  }

  handleCancel(event) {
    if(this.interval)
      clearInterval(this.interval)
    this.props.history.push('/login')
  }

  handleConfigure(event) {
    const user = this.state.user
    const device = this.state.device
    const identity = user + '@' + device
    const password = this.state.password
    const password2 = this.state.password2
    const token = this.state.token
    const configureDevice = this.props.dispatch.configureDevice

    event.preventDefault()
    if(password !== password2) {
      NotifyApi.notify("Signup error", "Passwords don't match")
      return
    }
    if(user !== '' && device !== '' && password !== '' && password2 !== '' && token !== '') {
      this.setState({
        ...this.state,
        pairing_message: 'Waiting pairing confirmation on the other device...'
      })
      configureDevice(identity, password, token)
      this.interval = setInterval(this.checkPairing, 1000);
    }
  }

  handleSignup(event) {
    const user = this.state.user
    const device = this.state.device
    const identity = user + '@' + device
    const password = this.state.password
    const password2 = this.state.password2
    const token = this.state.token
    const signup = this.props.dispatch.signup

    event.preventDefault()
    if(password !== password2) {
      NotifyApi.notify("Signup error", "Passwords don't match")
      return
    }
    if(user !== '' && device !== '' && password !== '' && password2 !== '' && token !== '') {
      signup(identity, password, token)
      this.props.history.push('/')
    }
  }

  checkPairing() {
    if(this.props.state.authentication.device_try_claim_submitted === 'CONFIGURE_DEVICE_SUCCESS')
      this.handleCancel()
    else if(this.props.state.authentication.device_try_claim_submitted) {
      this.setState({
        ...this.state,
        pairing_message: ''
      })
      clearInterval(this.interval)
    }
  }

  render() {
    const type = this.state.type
    const user = this.state.user
    const device = this.state.device
    const password = this.state.password
    const password2 = this.state.password2
    const token = this.state.token
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>REGISTRATION</h3>
          </div>
          <form onSubmit={this.handleSignup}>
            <div className="modal-body">
              <label>
                Type<br/>
                <select type="text" name="type" defaultValue="device" onChange={this.handleChange}>
                  <option value="device">Device</option>
                  <option value="user">User</option>
                </select>
              </label>
              <label>
                Identity: {this.state.user}@{this.state.device}<br/><br/>
              </label>
              <label>
                User<br/>
                <input type="text" name="user" value={user} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
              </label>
              <label>
                Device<br/>
                <input type="text" name="device" value={device} onChange={this.handleChange} onFocus={this.handleFocus}/>
              </label>
              <label>
                Password<br/>
                <input type="password" name="password" value={password} onChange={this.handleChange} onFocus={this.handleFocus}/>
              </label>
              <label>
                Repeat password<br/>
                <input type="password" name="password2" value={password2} onChange={this.handleChange} onFocus={this.handleFocus}/>
              </label>
              <label>
                Token<br/>
                <input type="text" name="token" value={token} onChange={this.handleChange} onFocus={this.handleFocus}/>
              </label>
              {this.state.pairing_message}
            </div>
            <div className="modal-footer">
              <button type="button" onClick={this.handleCancel} className="button third-button">Cancel</button>
              {type !== 'user' && this.state.pairing_message === '' &&
                <button type="button" onClick={this.handleConfigure} className="button main-button">Configure</button>
              }
              {type === 'user' &&
                <button type="button" onClick={this.handleSignup} className="button main-button">Signup</button>
              }
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Signup

import NotifyApi from '../api/notifyApi'
import React, { Component } from 'react'

import './Login.css'

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = { type: 'device', device: '', user: '', password: '', password2: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
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
      this.props.history.push('/login')
  }

  handleSignup(event) {
    const type = this.state.type
    const user = this.state.user
    const device = this.state.device
    const identity = user + '@' + device
    const password = this.state.password
    const password2 = this.state.password2
    const token = this.state.token
    const signup = this.props.dispatch.signup
    const configureDevice = this.props.dispatch.configureDevice

    event.preventDefault()
    if(password !== password2) {
      NotifyApi.notify("Signup error", "Passwords don't match")
      return
    }
    if(user !== '' && device !== '' && password !== '' && password2 !== '' && token !== '') {
      if(type === 'user')
        signup(identity, password, token)
      else
        configureDevice(identity, password, token)
      this.props.history.push('/')
    }
  }

  render() {
    const user = this.state.user
    const device = this.state.device
    const identity = this.state.identity
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
                <input type="text" name="device" value={device} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
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
                <input type="text" name="token" value={token} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={this.handleCancel} className="button third-button">Cancel</button>
              <button type="submit" className="button main-button" value="Submit">Signup</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Signup

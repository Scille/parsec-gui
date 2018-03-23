import React, { Component } from 'react'
import _ from 'lodash';
const Store = window.require('electron-store')

import './Login.css'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = { identity: '', password: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.props.dispatch.listLogins()
    this.store = new Store()
  }

  componentDidMount() {
    this.props.dispatch.init()
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name
    if(name === 'identity')
      this.store.set('last_identity', value)
    this.setState({ [name]: value })
  }

  handleLogin(event) {
    const logins = this.props.state.logins
    var identity = ''
    if(logins.length >= 1 && this.state.identity === '') {
      if(logins.indexOf(this.store.get('last_identity')) >= 0) {
        identity = this.store.get('last_identity')
      } else {
        identity = logins[0]
      }
    } else {
      identity = this.state.identity
    }
    this.store.set('last_identity', identity)
    const password = this.state.password
    const login = this.props.dispatch.login
    const mount = this.props.dispatch.mount
    event.preventDefault()
    if(identity !== '' && password !== '') {
      login(identity, password)
      if (this.store.get('enable_mountpoint', false)) {
        mount(this.store.get('mountpoint', 'mount'))
      }
    }
  }

  handleSignup(event) {
      this.props.history.push('/signup')
  }

  render() {
    const logins = this.props.state.logins
    const password = this.state.password
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>AUTHENTICATION</h3>
          </div>
          <form onSubmit={this.handleLogin}>
            <div className="modal-body">
              <label>
                Identity<br/>
                <select value={this.store.get('last_identity')} onChange={this.handleChange} name="identity" disabled={(logins.length === 0)}>
                  { _.range(0, logins.length).map(value => <option key={logins[value]} value={logins[value]}>{logins[value]}</option>) }
                </select>
              </label>
              <label>
                Password<br/>
                <input type="password" name="password" value={password} onChange={this.handleChange} onFocus={this.handleFocus} disabled={(logins.length === 0)}/>
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={this.handleSignup} className="button third-button">Signup</button>
              <button type="submit" className="button main-button" value="Submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login

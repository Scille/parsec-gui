import NotifyApi from '../api/notifyApi'
import React, { Component } from 'react'

import './Login.css'

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = { identity: '', password: '', password2: '' }

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
    const identity = this.state.identity
    const password = this.state.password
    const password2 = this.state.password2
    const signup = this.props.dispatch.signup

    event.preventDefault()
    if(password !== password2) {
      NotifyApi.notify("Signup error", "Passwords don't match")
      return
    }
    if(identity !== '' && password !== '' && password2 !== '') {
      signup(identity, password)
      this.props.history.push('/')
    }
  }

  render() {
    const identity = this.state.identity
    const password = this.state.password
    const password2 = this.state.password2

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>REGISTRATION</h3>
          </div>
          <form onSubmit={this.handleSignup}>
            <div className="modal-body">
              <label>
                Identity<br/>
                <input type="text" name="identity" value={identity} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
              </label>
              <label>
                Password<br/>
                <input type="password" name="password" value={password} onChange={this.handleChange} onFocus={this.handleFocus}/>
              </label>
              <label>
                Repeat password<br/>
                <input type="password" name="password2" value={password2} onChange={this.handleChange} onFocus={this.handleFocus}/>
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

import React, { Component } from 'react'
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'

import PersonalFilesContainer from '../containers/PersonalFilesContainer'
import DeletedFilesContainer from '../containers/DeletedFilesContainer'
import ManifestHistoryContainer from '../containers/ManifestHistoryContainer'
import LoginContainer from '../containers/LoginContainer'
import SignupContainer from '../containers/SignupContainer'
import ToolsContainer from '../containers/ToolsContainer'


import './App.css'

export class App extends Component {

  constructor(props) {
    super(props)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    this.props.dispatch.init()
    const logged = this.props.dispatch.logged
    logged()
  }

  componentWillUnmount() {
    this.props.dispatch.end()
  }

  handleLogout() {
    console.log('LOGOUT')
    const logout = this.props.dispatch.logout
    logout(this.props.state.authentication.fs_pid)
  }

  render() {
    const showModal = this.props.dispatch.showModal
    const hideModal = this.props.dispatch.hideModal
    const inviteUser = this.props.dispatch.inviteUser
    const declareDevice = this.props.dispatch.declareDevice
    const endDeclareDevice = this.props.dispatch.endDeclareDevice
    const listenEvents = this.props.dispatch.listenEvents
    const acceptDevice = this.props.dispatch.acceptDevice
    const inviteUserModal = () => {return { inviteUser, hideModal, user_invitation: this.props.state.authentication.user_invitation }}
    const declareDeviceModal = () => {return { declareDevice, endDeclareDevice, listenEvents, acceptDevice, hideModal, event_device_try_claim_subscribed: this.props.state.modalReducer }}
    const settingsModal = () => {return { hideModal }}
    const connected = this.props.state.socket.connected
    if(!connected) return (<div id="loader-wrapper"><div id="loader"></div></div>)
    const authenticated = this.props.state.authentication.authenticated
    if(!authenticated) {
      return (
        <Switch>
          <Route path='/signup' component={SignupContainer}/>
          <Route path='/login' component={LoginContainer}/>
          <Redirect from='/' to='/login'/>
        </Switch>
      )
    }

    return (
      <Router>
        <div className="app">
          <div className="sidebar">
            <nav>
              <ul className="header">
                <li><i className="parsec-logo"/></li>
              </ul>

              <ToolsContainer/>

              <ul className="footer">
                <li><a onClick={() => showModal('inviteUserModal', inviteUserModal())} href="#"><i className="fa fa-user-plus fa-2x" title="Invite user"/></a></li>
                <li><a onClick={() => showModal('declareDeviceModal', declareDeviceModal())} href="#"><i className="fa fa-plus-square fa-2x" title="Declare device"/></a></li>
                <li><a onClick={() => showModal('settingsModal', settingsModal())} href="#"><i className="fa fa-cog fa-2x" title="Settings"/></a></li>
                <li><a onClick={() => this.handleLogout()} href="#"><i className="fa fa-power-off fa-2x" title="Logout"/></a></li>
              </ul>
            </nav>
          </div>

          <div className="content">
            <Switch>
              {/* PersonalFiles component */}
              <Route exact path='/login' component={PersonalFilesContainer}/>
              <Route exact path='/' component={PersonalFilesContainer}/>
              <Redirect from='/personal-files' to='/'/>
              {/* DeletedFiles component */}
              <Route path='/deleted-files' component={DeletedFilesContainer}/>
              {/* History component */}
              <Route path='/history' component={ManifestHistoryContainer}/>
              {/* Errors component */}
              <Redirect to='/404'/>
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}
export default App

              // <ul className="navbar">
              //   <li><Link to="/personal-files"><i className="fa fa-home fa-2x" title="Personal Files"/></Link></li>
              //   <li><Link to="/deleted-files"><i className="fa fa-trash-o fa-2x" title="Deleted Files"/></Link></li>
              //   <li><Link to="/history"><i className="fa fa-history fa-2x" title="History"/></Link></li>
              // </ul>
              // <hr/>
              // <hr/>
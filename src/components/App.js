import React, { Component } from 'react'
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
  Link
} from 'react-router-dom'

import PersonalFilesContainer from '../containers/PersonalFilesContainer'
import DeletedFilesContainer from '../containers/DeletedFilesContainer'
import ManifestHistoryContainer from '../containers/ManifestHistoryContainer'
import LoginContainer from '../containers/LoginContainer'
import SignupContainer from '../containers/SignupContainer'

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
    const logout = this.props.dispatch.logout
    logout()
  }

  render() {
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
              <ul className="navbar">
                <li><Link to="/personal-files"><i className="fa fa-files-o fa-2x"/></Link></li>
                <li><Link to="/deleted-files"><i className="fa fa-trash-o fa-2x"/></Link></li>
                <li><Link to="/history"><i className="fa fa-history fa-2x"/></Link></li>
              </ul>
              <ul className="footer">
                <li><a onClick={this.handleLogout} href="#"><i className="fa fa-power-off fa-2x"/></a></li>
                <li><Link to="/parameters"><i className="fa fa-cog fa-2x"/></Link></li>
              </ul>
            </nav>
          </div>

          <div className="content">
            <Switch>
              {/* PersonalFiles component */}
              <Route path='/' component={PersonalFilesContainer}/>
              <Redirect from='/personal-files' to='/'/>
              {/* DeletedFiles component */}
              <Route path='/deleted-files' component={DeletedFilesContainer}/>
              {/* History component */}
              <Route path='/history' component={ManifestHistoryContainer}/>
              {/* Parameters component */}
              {/* <Route path='/parameters' component={NoMatchError}/> */}
              <Redirect from='/parameters' to='/404'/>
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

import React from 'react'
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
  Link
} from 'react-router-dom'

import PersonalFilesContainer from '../containers/PersonalFilesContainer'
import DeletedFilesContainer from '../containers/DeletedFilesContainer'
import { SocketError, NoMatchError } from './Errors.js'

import './App.css'

const App = () => (
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
          </ul>
          <ul className="footer">
            <li><Link to="/parameters"><i className="fa fa-cog fa-2x"/></Link></li>
          </ul>
        </nav>
      </div>

      <div className="content">
        <Switch>
          <Route exact path='/' component={PersonalFilesContainer}/>
          {/* PersonalFiles component */}
          <Redirect from='/personal-files' to='/'/>
          {/* DeletedFiles component */}
          <Route path='/deleted-files' component={DeletedFilesContainer}/>
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

const AppRouter = () => (
  <Router>
    <Switch>
      {/* Errors component */}
      <Route path='/socket-error' component={SocketError}/>
      <Route path='/404' component={NoMatchError}/>
      {/* App component */}
      <Route path='/' component={App}/>
    </Switch>
  </Router>
)
export default AppRouter

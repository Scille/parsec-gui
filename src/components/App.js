import React from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
  Link
} from 'react-router-dom';

import PersonalFilesContainer from '../containers/PersonalFilesContainer'
// import Login from './Login';
// import NotFound from './NotFound';

import './App.css'

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)


const AppRouter = () => (
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
          <Route path='/deleted-files' component={NoMatch}/>
          {/* Parameters component */}
          <Route path='/parameters' component={NoMatch}/>
          {/* NotFound component */}
          <Route component={NoMatch}/>
        </Switch>
      </div>
    </div>
  </Router>
)
export default AppRouter

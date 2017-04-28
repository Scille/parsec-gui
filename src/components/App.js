import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link
} from 'react-router-dom';

import PersonalFilesContainer from '../containers/PersonalFilesContainer'
import DeletedFiles from './DeletedFiles';
import Parameters from './Parameters';
// import Login from './Login';
import NotFound from './NotFound';

import './App.css'

const App = ({ match }) => (
  <div className="app">
    <div className="sidebar">
      <nav>
        <ul className="header">
          <li><Link to="/"><i className="parsec-logo"/></Link></li>
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
      {/* NB: match.url === '/' */}
      <Switch>
        {/* PersonalFiles component */}
        <Redirect from={`${match.url}personal-files`} to="/"/>
        <Route exact path={match.url} component={PersonalFilesContainer}/>
        {/* DeletedFiles component */}
        <Route path={`${match.url}deleted-files`} component={DeletedFiles}/>
        {/* Parameters component */}
        <Route path={`${match.url}parameters`} component={Parameters}/>

        <Redirect to="/404"/>
      </Switch>
    </div>
  </div>
)

const AppRouter = () => (
  <Router>
    <Switch>
      {/* NotFound component */}
      <Route path="/404" component={NotFound}/>

      {/* Login component */}
      {/* <Route path="/login" component={Login}/> */}

      {/* App components */}
      <Route path="/" component={App}/>
    </Switch>
  </Router>
)
export default AppRouter

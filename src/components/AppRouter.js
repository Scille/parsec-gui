import React from 'react'
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import AppContainer from '../containers/AppContainer'
import { SocketError, NoMatchError } from './Errors.js'

const AppRouter = () => (
  <Router>
    <Switch>
      {/* Errors component */}
      <Route path='/socket-error' component={SocketError}/>
      <Route path='/404' component={NoMatchError}/>
      {/* App component */}
      <Route path='/' component={AppContainer}/>
    </Switch>
  </Router>
)

export default AppRouter

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

import './App.css'

export class App extends Component {
  componentDidMount() {
    this.props.dispatch.init()
  }

  componentWillUnmount() {
    this.props.dispatch.end()
  }

  render() {
    const connected = this.props.state.socket.connected
    if(!connected) return (<div id="loader-wrapper"><div id="loader"></div></div>)

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
                <li><Link to="/parameters"><i className="fa fa-cog fa-2x"/></Link></li>
              </ul>
            </nav>
          </div>

          <div className="content">
            <Switch>
              {/* PersonalFiles component */}
              <Route exact path='/' component={PersonalFilesContainer}/>
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

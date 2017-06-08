import React, { Component } from 'react'

import ModalsContainer from '../containers/ModalsContainer'

import './History.css'

class ManifestHistory extends Component {

  componentDidMount() {
    this.props.dispatch.init()
  }

  render() {
    const history = this.props.state.history
    const loading = this.props.state.socket.loading

    const refresh = this.props.dispatch.refresh
    const restoreVersion = this.props.dispatch.restoreVersion
    const showModal = this.props.dispatch.showModal
    const hideModal = this.props.dispatch.hideModal

    const entries = (data) => {
      const added = Object.keys(data.added)
      const removed = Object.keys(data.removed)
      const changed = Object.keys(data.changed)
      const length = added.length + removed.length + changed.length
      if(length === 0) return null

      return(
        <label>
          <i className="fa fa-folder-o"/> Personal Files
          <input type="checkbox" defaultChecked="checked"/>
          <ul>
            { added.map((data) => <li key={data}><i className="fa fa-added"> {data}</i></li>) }
            { changed.map((data) => <li key={data}><i className="fa fa-changed"> {data}</i></li>) }
            { removed.map((data) => <li key={data}><i className="fa fa-removed"> {data}</i></li>) }
          </ul>
        </label>
      )
    }

    const dustbin = (data) => {
      const added = data.added
      const removed = data.removed
      const length = added.length + removed.length
      if(length === 0) return null

      return(
        <label>
          <i className="fa fa-folder-o"/> Deleted Files
          <input type="checkbox" defaultChecked="checked"/>
          <ul>
            { added.map((data) => <li key="dustbin_{data.id}"><i className="fa fa-added"> {data.path}</i></li>) }
            { removed.map((data) => <li key="dustbin_{data.id}"><i className="fa fa-removed"> {data.path}</i></li>) }
          </ul>
        </label>
      )
    }

    const listVersions = history.reverse().map((data, i) => {
      const restoreVersionModal = { version: data.version, restoreVersion, hideModal }

      return (
        <li key={data.version}>
          <div className="version">V.{data.version}</div>
          <div className="tree-view">
            { entries(data.entries) }
            { dustbin(data.dustbin) }
          </div>
          <div className="options">
            {
              i === 0 ?
              <a className="button disabled-button">Current</a>
              :
              <a onClick={() => showModal('restoreVersionModal', restoreVersionModal)} className="button main-button">Restore</a>
            }
          </div>
        </li>
      )
    })

    return (
      <div className="history">
        <div className="header">
          <div className="title">History</div>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-v"/>
              <div className="dropdown-content">
                <div>Actions</div>
                <a onClick={() => refresh()}><i className="fa fa-refresh"/> Refresh</a>
              </div>
            </div>
          </div>
      	</div>
        <div className='history-view'>
          { loading ? (<div id="loader-wrapper"><div id="loader"></div></div>) : (<ul>{ listVersions }</ul>) }
        </div>

        <ModalsContainer></ModalsContainer>
      </div>
    )
  }
}

export default ManifestHistory

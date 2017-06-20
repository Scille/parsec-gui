import React, { Component } from 'react'

import ModalsContainer from '../containers/ModalsContainer'

import './ViewSwitcher.css'

class DeletedFiles extends Component {

  componentDidMount() {
    this.props.dispatch.init()
  }

  render() {
    const files = this.props.state.files
    const listView = this.props.state.listView
    const loading = this.props.state.socket.loading

    const refresh = this.props.dispatch.refresh
    const restoreFile = this.props.dispatch.restoreFile
    const switchView = this.props.dispatch.switchView
    const showModal = this.props.dispatch.showModal
    const hideModal = this.props.dispatch.hideModal

    const listFiles = files.map((file, i) => {
      const detailsModal = { file, hideModal }
      const restoreModal = { file, restoreFile, hideModal }
      return (
        <li key={i}>
          <a>
            <div className="icon"><i className='fa fa-file-o'/></div>
            <div className="title">{file.name}</div>
            <div className="details"></div>
          </a>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-h"/>
              <div className="dropdown-content dropdown-content-right">
                <a onClick={() => showModal('detailsModal', detailsModal)}><i className="fa fa-info"/> Details</a>
                <a onClick={() => showModal('restoreModal', restoreModal)}><i className="fa fa-undo"/> Restore</a>
              </div>
            </div>
          </div>
        </li>
      )
    })

    return (
      <div className="view-switcher">
        <div className="header">
          <div className="title">Deleted Files</div>
          <div className="breadcrumb">
            <ul>
              <li>
                <div className="dropdown">
                  <i className="fa fa-2x fa-folder-open"/>
                </div>
              </li>
              <li>Trash</li>
            </ul>
          </div>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-v"/>
              <div className="dropdown-content dropdown-content-right">
                <div>Views</div>
                <a onClick={() => switchView()}><i className={listView ? 'fa fa-th-large' : 'fa fa-th-list'}/>{listView ? ' Grid' : ' List'}</a>
                <div>Actions</div>
                <a onClick={() => refresh()}><i className="fa fa-refresh"/> Refresh</a>
              </div>
            </div>
          </div>
      	</div>
        <div className={listView ? 'file-view list-view' : 'file-view grid-view'}>
          { loading ? (<div id="loader-wrapper"><div id="loader"></div></div>) : (<ul>{ listFiles }</ul>) }
        </div>

        <ModalsContainer></ModalsContainer>
      </div>
    )
  }
}

export default DeletedFiles

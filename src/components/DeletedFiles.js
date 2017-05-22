import React, { Component } from 'react'

import ModalsContainer from '../containers/ModalsContainer'

import './ViewSwitcher.css'

class DeletedFiles extends Component {

  componentDidMount() {
    this.props.dispatch.init()
  }

  componentWillUnmount() {
    this.props.dispatch.end()
  }

  render() {
    const files = this.props.state.files
    const listView = this.props.state.listView

    const refresh = this.props.dispatch.refresh
    const restoreFile = this.props.dispatch.restoreFile
    const switchView = this.props.dispatch.switchView
    const showModal = this.props.dispatch.showModal
    const hideModal = this.props.dispatch.hideModal

    const listFiles = files.map((file, i) => {
      const detailsModal = { file, hideModal }
      const restoreModal = {
        id: file.id,
        name: file.name,
        route: file.route,
        restoreFile,
        hideModal
      }
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
              <div className="dropdown-content">
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
              <li><a onClick={() => refresh()}>Trash</a></li>
            </ul>
          </div>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-v"/>
              <div className="dropdown-content">
                <div>Views</div>
                <a onClick={switchView}><i className={!listView ? 'fa fa-th-large' : 'fa fa-th-list'}/>{!listView ? ' Grid' : ' List'}</a>
                <div>Actions</div>
                <a onClick={() => refresh()}><i className="fa fa-refresh"/> Refresh</a>
              </div>
            </div>
          </div>
      	</div>
        <div className={listView ? 'file-view grid-view' : 'file-view list-view'}>
          <ul>
            { listFiles }
          </ul>
        </div>

        <ModalsContainer></ModalsContainer>
      </div>
    )
  }
}

export default DeletedFiles

import React, { Component } from 'react'

import ModalsContainer from '../containers/ModalsContainer'
import { bytesToSize } from '../common'

import './ViewSwitcher.css'

class PersonalFiles extends Component {

  componentDidMount() {
    this.props.dispatch.init()
  }

  componentWillUnmount() {
    this.props.dispatch.end()
  }

  render() {
    const files = this.props.state.files
    const listView = this.props.state.listView
    const breadcrumb = this.props.state.breadcrumb
    const path = breadcrumb[breadcrumb.length -1].route

    const moveTo = this.props.dispatch.moveTo
    const moveUp = this.props.dispatch.moveUp
    const refresh = this.props.dispatch.refresh
    const createFiles = this.props.dispatch.createFiles
    const renameFile = this.props.dispatch.renameFile
    const deleteFile = this.props.dispatch.deleteFile
    const createDir = this.props.dispatch.createDir
    const removeDir = this.props.dispatch.removeDir
    const switchView = this.props.dispatch.switchView
    const showModal = this.props.dispatch.showModal
    const hideModal = this.props.dispatch.hideModal

    const createDirModal = { path, createDir, hideModal }

    const listFiles = files.map((file, i) => {
      const icon = file['id'] !== null? 'fa fa-file-o' : 'fa fa-folder-o'
      const detailsModal = { file, hideModal }
      const renameModal = { path, name: file.name, renameFile, hideModal }
      const removeModal = {
        path,
        name: file.name,
        title: file.id !== null? 'DELETE FILE' : 'DELETE DIRECTORY',
        removeFunc: file.id !== null? deleteFile : removeDir,
        hideModal
      }
      return (
        <li key={i}>
          <a onClick={() => file.id === null? moveTo(path, file.name) : null}>
            <div className="icon"><i className={icon}/></div>
            <div className="title">{file.name}</div>
            <div className="details">{bytesToSize(file['size'])}</div>
          </a>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-h"/>
              <div className="dropdown-content">
                <a onClick={() => showModal('detailsModal', detailsModal)}><i className="fa fa-info"/> Details</a>
                <a onClick={() => showModal('renameModal', renameModal)}><i className="fa fa-pencil-square-o"/> Rename</a>
                <a onClick={() => console.log("Share")}><i className="fa fa-user-plus"/> Share</a>
                <a onClick={() => showModal('removeModal', removeModal)}><i className="fa fa-trash-o"/> Delete</a>
              </div>
            </div>
          </div>
        </li>
      )
    })

    return (
      <div className="view-switcher">
        <div className="header">
          <div className="title">Personal Files</div>
          <div className="breadcrumb">
            <ul>
              { breadcrumb.map((path, i) => <li key={i}><a onClick={() => moveUp(path.route, i)}>{path.libelle}</a></li>) }
            </ul>
          </div>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-v"/>
              <div className="dropdown-content">
                <div>Views</div>
                <a onClick={switchView}><i className={!listView ? 'fa fa-th-large' : 'fa fa-th-list'}/>{!listView ? ' Grid' : ' List'}</a>
                <div>Actions</div>
                <a onClick={() => refresh(path)}><i className="fa fa-refresh"/> Refresh</a>
                <a onClick={() => showModal('createDirModal', createDirModal)}><i className="fa fa-folder"/> New Folder</a>
                <a>
                  <i className="fa fa-file"/>
                  <input type="file" name="file" id="file" className="input-file" onChange={(event) => {createFiles(path, event.target.files)}} multiple/>
                  <label htmlFor="file"> Add Files</label>
                </a>
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

export default PersonalFiles

import React, { Component } from 'react'

import ModalsContainer from '../containers/ModalsContainer'
import { bytesToSize } from '../common'

import './ViewSwitcher.css'

class PersonalFiles extends Component {

  constructor(props) {
    super(props)
    this.state = { drag: false }

    this.handleDrag = this.handleDrag.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
  }

  componentDidMount() {
    this.props.dispatch.init()
  }

  componentWillUnmount() {
    this.props.dispatch.end()
  }

  handleDrag() {
    this.setState({ drag: true });
  }

  handleDragOver() {
    this.setState({ drag: false });
  }

  render() {
    const files = this.props.state.files
    const listView = this.props.state.listView
    const loading = this.props.state.socket.loading
    const breadcrumb = this.props.state.breadcrumb
    const currentPath = breadcrumb[breadcrumb.length -1]

    const moveTo = this.props.dispatch.moveTo
    const moveUp = this.props.dispatch.moveUp
    const search = this.props.dispatch.search
    const refresh = this.props.dispatch.refresh
    const createFiles = this.props.dispatch.createFiles
    const renameFile = this.props.dispatch.renameFile
    const deleteFile = this.props.dispatch.deleteFile
    const downloadFile = this.props.dispatch.downloadFile
    const createDir = this.props.dispatch.createDir
    const removeDir = this.props.dispatch.removeDir
    const switchView = this.props.dispatch.switchView
    const showModal = this.props.dispatch.showModal
    const hideModal = this.props.dispatch.hideModal

    const searchModal = { search, hideModal }
    const createDirModal = { path: currentPath.route, createDir, hideModal }

    const listFiles = files.map((file, i) => {
      const icon = file.type === 'file' ? 'fa fa-file-o' : 'fa fa-folder-o'
      const detailsModal = { file, hideModal }
      const renameModal = { file, renameFile, hideModal }
      const removeModal = {
        file,
        title: file.type === 'file' ? 'DELETE FILE' : 'DELETE DIRECTORY',
        removeFunc: file.type === 'file' ? deleteFile : removeDir,
        hideModal
      }
      return (
        <li key={i}>
          <a onClick={() => file.type === 'folder' ? moveTo(currentPath.route, file.name) : null}>
            <div className="icon"><i className={icon}/></div>
            <div className="title">{file.name}</div>
            <div className="details">{bytesToSize(file['size'])}</div>
          </a>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-h"/>
              <div className="dropdown-content dropdown-content-right">
                <a onClick={() => showModal('detailsModal', detailsModal)}><i className="fa fa-info"/> Details</a>
                { file.type === 'file' && <a onClick={() => downloadFile(file)}><i className="fa fa-download"/> Download</a> }
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
          <div className="title">
            Personal Files
          </div>
          <div className="breadcrumb">
            <ul>
              <li>
                <div className="dropdown">
                  <i className="fa fa-2x fa-folder-open"/>
                  <div className="dropdown-content">
                    { breadcrumb.map((path, i) => <a key={path.route} onClick={() => moveUp(path.route, i)}>{path.libelle}</a>) }
                  </div>
                </div>
              </li>
              <li>{ currentPath.libelle }</li>
            </ul>
          </div>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-v"/>
              <div className="dropdown-content dropdown-content-right">
                <div>Views</div>
                <a onClick={switchView}><i className={listView ? 'fa fa-th-large' : 'fa fa-th-list'}/>{listView ? ' Grid' : ' List'}</a>
                <div>Actions</div>
                <a onClick={() => showModal('searchModal', searchModal)}><i className="fa fa-search"/> Search</a>
                <a onClick={() => refresh(currentPath.route)}><i className="fa fa-refresh"/> Refresh</a>
                <a onClick={() => showModal('createDirModal', createDirModal)}><i className="fa fa-folder"/> New Folder</a>
                <a>
                  <i className="fa fa-file"/>
                  <input type="file" name="file" id="file" className="input-file" onChange={(event) => {createFiles(currentPath.route, event.target.files)}} multiple/>
                  <label htmlFor="file"> Add Files</label>
                </a>
              </div>
            </div>
          </div>
      	</div>
        <div className="dropzone" onDrag={this.handleDrag}>
          <div className={listView ? 'file-view list-view' : 'file-view grid-view'}>
            { loading ? (<div id="loader-wrapper"><div id="loader"></div></div>) : (<ul>{ listFiles }</ul>) }
          </div>
          { this.state.drag && <input type="file" onChange={(event) => {createFiles(currentPath.route, event.target.files)}}/> }
        </div>
        <ModalsContainer></ModalsContainer>
      </div>
    )
  }
}

export default PersonalFiles

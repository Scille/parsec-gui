import React, { Component } from 'react'

import ModalsContainer from '../containers/ModalsContainer'
import { bytesToSize } from '../common'

import './ViewSwitcher.css'

class PersonalFiles extends Component {

  constructor(props) {
    super(props)
    this.state = { drag: false }

    this.selectFile = this.selectFile.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)

    var breadcrumb = this.props.state.breadcrumb
    this.currentPath = breadcrumb[breadcrumb.length -1]
    this.refresh = this.props.dispatch.refresh

    this.selectedFiles = []
  }

  componentDidMount() {
    this.props.dispatch.init()
    this.interval = setInterval(this.tick, 3000, this)
  }

  componentWillUnmount() {
    this.props.dispatch.end()
    clearInterval(this.interval)
  }

  selectFile(event, file) {
    const target = event.target
    const selected = target.type === 'checkbox' ? target.checked : target.value;
    if(selected) {
      this.selectedFiles.push(file)
    } else {
      const index = this.selectedFiles.indexOf(file)
      this.selectedFiles.splice(index, 1)
    }
  }

  handleDrop(event, path, allowed=false) {
    event.stopPropagation()
    var files = JSON.parse(event.dataTransfer.getData('files'))
    for (var i = 0; i < files.length; i++) {
      document.getElementById(files[i].path).classList.remove('drag')
      if(allowed) {
        document.getElementById(path).classList.remove('drag-over')
        this.props.dispatch.moveFile(files[i], path)
      }
    }
    this.selectedFiles = []
  }

  handleDragStart(event, files) {
    event.dataTransfer.setData('files', JSON.stringify(files))
    for (var i = 0; i < files.length; i++) {
      document.getElementById(files[i].path).classList.add('drag')
    }
  }

  handleDragOver(event, path, allowed=false) {
    if(allowed){
      event.preventDefault()
      document.getElementById(path).classList.add('drag-over')
    }
  }

  handleDragLeave(event, path) {
    document.getElementById(path).classList.remove('drag-over')
  }

  tick(obj) {
    obj.refresh(obj.currentPath.route, false)
  }

  render() {
    const files = this.props.state.files
    const view = this.props.state.view
    const loading = this.props.state.socket.loading
    const loading_animation = this.props.state.view.loading_animation
    const breadcrumb = this.props.state.breadcrumb
    this.currentPath = breadcrumb[breadcrumb.length -1]

    const moveTo = this.props.dispatch.moveTo
    const moveUp = this.props.dispatch.moveUp
    this.refresh = this.props.dispatch.refresh
    const createFiles = this.props.dispatch.createFiles
    const searchFile = this.props.dispatch.searchFile
    const renameFile = this.props.dispatch.renameFile
    const deleteFile = this.props.dispatch.deleteFile
    const openFile = this.props.dispatch.openFile
    const createDir = this.props.dispatch.createDir
    const removeDir = this.props.dispatch.removeDir
    const switchView = this.props.dispatch.switchView
    const showModal = this.props.dispatch.showModal
    const hideModal = this.props.dispatch.hideModal

    const searchModal = { searchFile, hideModal }
    const createDirModal = { path: this.currentPath.route, createDir, hideModal }

    const ListFiles = () => {
      if(loading && loading_animation)
        return (<div id="loader-wrapper"><div id="loader"></div></div>)

      if(files.length === 0)
        return (
          <div className="empty-list">
            <i className="fa fa-folder-open-o"/>
            <h1>This folder is empty</h1>
          </div>
        )

      const listFiles = files.map((file) => {
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
          <li id={file.path} key={file.path} draggable="true"
            onDrop={(event) => this.handleDrop(event, file.path, file.type === 'folder')}
            onDragStart={(event) => {
              if(this.selectedFiles.length === 0) {
                this.handleDragStart(event, [file])
              } else {
                this.handleDragStart(event, this.selectedFiles)
              }
            }}
            onDragOver={(event) => this.handleDragOver(event, file.path, file.type === 'folder')}
            onDragLeave={(event) => this.handleDragLeave(event, file.path)}>
            <input id={'select_' + file.path} name={file.path} type="checkbox" onChange={(event) => this.selectFile(event, file)} />
            <a onClick={() => {
              if(this.selectedFiles.length !== 0) {
                var state = document.getElementById('select_' + file.path).checked
                if(!state) {
                  this.selectedFiles.push(file)
                } else {
                  const index = this.selectedFiles.indexOf(file)
                  this.selectedFiles.splice(index, 1)
                }
                document.getElementById('select_' + file.path).checked = !state
              } else {
                file.type === 'folder' ? moveTo(this.currentPath.route, file.name) : openFile(file)}
              }}>
              <div className="icon"><i className={icon}/></div>
              <div className="title">{file.name}</div>
              <div className="details">{bytesToSize(file['size'])}</div>
            </a>
            <div className="options">
              <div className="dropdown">
                <i className="fa fa-ellipsis-h"/>
                <div className="dropdown-content dropdown-content-right">
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
        <div className={view.list ? 'file-view list-view' : 'file-view grid-view'}>
          <ul>{ listFiles }</ul>
        </div>
      )
    }

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
              <li>{ this.currentPath.libelle }</li>
            </ul>
          </div>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-v"/>
              <div className="dropdown-content dropdown-content-right">
                <div>Views</div>
                <a onClick={switchView}><i className={view.list ? 'fa fa-th-large' : 'fa fa-th-list'}/>{view.list ? ' Grid' : ' List'}</a>
                <div>Actions</div>
                <a onClick={() => showModal('searchModal', searchModal)}><i className="fa fa-search"/> Search</a>
                <a onClick={() => this.refresh(this.currentPath.route, true)}><i className="fa fa-refresh"/> Refresh</a>
                <a onClick={() => showModal('createDirModal', createDirModal)}><i className="fa fa-folder"/> New Folder</a>
                <a>
                  <i className="fa fa-file"/>
                  <input type="file" name="file" id="file" className="input-file" onChange={(event) => {createFiles(this.currentPath.route, event.target.files)}} multiple/>
                  <label htmlFor="file"> Add Files</label>
                </a>
              </div>
            </div>
          </div>
      	</div>

        { ListFiles() }
        <ModalsContainer></ModalsContainer>
      </div>
    )
  }
}

export default PersonalFiles

import React, { Component } from 'react'

class Tools extends Component {
  constructor(props) {
    super(props)

    var breadcrumb = this.props.state.breadcrumb
    this.currentPath = breadcrumb[breadcrumb.length -1]
  }

  componentDidMount() {
    this.props.dispatch.init()
  }

  render() {
    const selected = this.props.state.selection.selected
    const cutted = this.props.state.selection.cutted
    // const view = this.props.state.view
    // const loading = this.props.state.socket.loading
    // const loading_animation = this.props.state.view.loading_animation
    const breadcrumb = this.props.state.breadcrumb
    this.currentPath = breadcrumb[breadcrumb.length -1]

    const refresh = this.props.dispatch.refresh
    const createFiles = this.props.dispatch.createFiles
    // const searchFile = this.props.dispatch.searchFile
    const renameFile = this.props.dispatch.renameFile
    const moveFile = this.props.dispatch.moveFile
    const cutFiles = this.props.dispatch.cutFiles
    const deleteFile = this.props.dispatch.deleteFile
    const shareFile = this.props.dispatch.shareFile
    const historyFile = this.props.dispatch.historyFile

    // const openFile = this.props.dispatch.openFile
    const createDir = this.props.dispatch.createDir
    // const switchView = this.props.dispatch.switchView
    const showModal = this.props.dispatch.showModal
    const hideModal = this.props.dispatch.hideModal

    // const searchModal = { searchFile, hideModal }
    const createDirModal = { path: this.currentPath.route, createDir, hideModal }
    const detailsModal = (file) => {return { file, hideModal }}
    const renameModal = (file) => {return { file, renameFile, hideModal }}
    const shareModal = (file) => {return { file, shareFile, hideModal }}
    const historyModal = (file) => {return { file, historyFile, hideModal }}
    const removeModal = (files) => {
      if(files.length > 1) {
        var title = 'DELETE ' + files.length + ' ITEMS'
      } else {
        title = files[0].type === 'file' ? 'DELETE FILE' : 'DELETE DIRECTORY'
      }
      return {
        files,
        title: title,
        removeFunc: deleteFile,
        hideModal
      }
    }

    if (selected.length === 0) {
      return (
        <ul className="tools">
          <li>
            <a><input type="file" name="file" id="file" className="input-file" onChange={(event) => {createFiles(this.currentPath.route, event.target.files)}} multiple/>
            <label htmlFor="file"><i className="fa fa-file" title="Upload file"/></label></a>
          </li>
          <li><a onClick={() => {showModal('createDirModal', createDirModal)}}><i className="fa fa-folder" title="Create directory"/></a></li>
          {cutted.length > 0 && 
            <li><a onClick={() => {for(var i = 0; i < cutted.length; i++) moveFile(cutted[i], this.currentPath.route); refresh(this.currentPath.route, true)}}><i className="fa fa-paste" title="Paste"/></a></li>
          }
          <li><a onClick={() => console.log('SHOW/HIDE DELETED FILED')}><i className="fa fa-eye" title="View deleted files"/></a></li>
          <li><a onClick={() => refresh(this.currentPath.route, true)}><i className="fa fa-refresh" title="Refresh"/></a></li>
        </ul>
      )
    } else {
      return (
        <ul className="tools">
          {selected.length === 1 &&
            [<li key='1'><a onClick={() => showModal('detailsModal', detailsModal(selected[0]))}><i className="fa fa-info" title="Details"/></a></li>,
            <li key='2'><a onClick={() => showModal('shareModal', shareModal(selected[0]))}><i className="fa fa-share-alt" title="Share"/></a></li>,
            <li key='3'><a onClick={() => showModal('historyModal', historyModal(selected[0]))}><i className="fa fa-history" title="History"/></a></li>,
            <li key='4'><a onClick={() => showModal('renameModal', renameModal(selected[0]))}><i className="fa fa-i-cursor" title="Rename"/></a></li>]
          }
          <li><a onClick={() => {cutFiles(selected)}}><i className="fa fa-cut" title="Cut"/></a></li>
          <li><a onClick={() => console.log('CACHE')}><i className="fa fa-cloud-download" title="Offline"/></a></li>
          {cutted.length > 0 && 
            <li><a onClick={() => {for(var i = 0; i < cutted.length; i++) moveFile(cutted[i], this.currentPath.route)}}><i className="fa fa-paste" title="Paste"/></a></li>
          }
          <li><a onClick={() => showModal('removeModal', removeModal(selected))}><i className="fa fa-trash" title="Delete"/></a></li>
        </ul>
      )
    }
  }
}

export default Tools

            // <div className="options">
            //   <div className="dropdown">
            //     <i className="fa fa-ellipsis-h"/>
            //     <div className="dropdown-content dropdown-content-right">
            //       <a onClick={() => showModal('detailsModal', detailsModal)}><i className="fa fa-info"/> Details</a>
            //       <a onClick={() => showModal('renameModal', renameModal)}><i className="fa fa-pencil-square-o"/> Rename</a>
            //       <a onClick={() => console.log("Share")}><i className="fa fa-user-plus"/> Share</a>
            //       <a onClick={() => showModal('removeModal', removeModal)}><i className="fa fa-trash-o"/> Delete</a>
            //     </div>
            //   </div>
            // </div>

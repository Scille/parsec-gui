import React, { Component } from 'react'

import ModalsContainer from '../containers/ModalsContainer'
import { bytesToSize } from '../common'

import './ViewSwitcher.css'

class PersonalFiles extends Component {

  constructor(props) {
    super(props)
    this.selectFile = this.selectFile.bind(this)
    this.isSelected = this.isSelected.bind(this)

    var breadcrumb = this.props.state.breadcrumb
    this.currentPath = breadcrumb[breadcrumb.length -1]
    this.refresh = this.props.dispatch.refresh
  }

  componentDidMount() {
    console.log('mount')
    this.props.dispatch.init()
    console.log(this.tick)
    this.interval = setInterval(this.tick, 3000, this.currentPath.route)
  }

  componentWillUnmount() {
    console.log('Umount')
    this.props.dispatch.end()
    clearInterval(this.interval)
  }

  isSelected(file) {
    for(var i = 0; i < this.props.state.selection.selected.length; i++) {
      if(this.props.state.selection.selected[i].path === file.path) {
        console.log(file.path + ' selected')
        return true
      }
    }
    return false
  }

  selectFile(event, file) {
    const selected = !this.isSelected(file)
    this.props.dispatch.selectFile(file, selected)
  }

  tick(path) {
    console.log('RE ' + path)
    this.props.dispatch.refresh(path, false)
  }

  render() {
    console.log('RENDER PERSONAL FILE')
    console.log(this.props.state.selection)
    const files = this.props.state.files
    const selected = this.props.state.selection.selected
    const view = this.props.state.view
    const loading = this.props.state.socket.loading
    const loading_animation = this.props.state.view.loading_animation
    const breadcrumb = this.props.state.breadcrumb
    this.currentPath = breadcrumb[breadcrumb.length -1]

    const openFile = this.props.dispatch.openFile
    const moveTo = this.props.dispatch.moveTo
    const moveUp = this.props.dispatch.moveUp

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
        const details = file.type === 'file' ? bytesToSize(file['size']) : file.children.length + ' element' + (file.children.length > 1 ? 's' : '')
        const hidden = (selected.length === 0) ? 'hidden' : ''
        var selected_file = this.isSelected(file)
        return (
          <a key={file.path} onClick={(event) => {
            if(selected.length === 0) {
              file.type === 'folder' ? moveTo(this.currentPath.route, file.name) : openFile(file)
            } else {
              this.selectFile(event, file)
            }
            }}>
          <li className="file-item" id={file.path}>
            <input className={hidden} id={'select_' + file.path} name={file.path} type="checkbox" title={selected_file ? 'Deselect' : 'Select'} onClick={(event) => {this.selectFile(event, file); event.stopPropagation()}} checked={selected_file}/>
            <div className="icon"><i className={icon}/></div>
            <div className="title">{file.name}</div>
            <div className="details">{details}</div>
          </li>
          </a>
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
          <div className="search">
            <span className="fa fa-search"></span>
            <input onClick={() => console.log('SEARCH')} placeholder="Search"/>
          </div>
          <div className="breadcrumb">
            <ul>
              <li>
                <div className="dropdown-content">
                {breadcrumb.map((path, i) => 
                  <button key={path.route} onClick={() => moveUp(path.route, i)} className={`button path-button ${i === 0 ? 'first-path-button' : ''} ${(i + 1) === breadcrumb.length ? 'last-path-button' : ''}`}>{(i + 1) === breadcrumb.length ? <i className="fa fa-folder-open"/> : ''} {path.libelle}</button>
                )}
                </div>
              </li>
            </ul>
          </div>
          <div className="clear"></div>
      	</div>
        { ListFiles() }
        <ModalsContainer></ModalsContainer>
      </div>
    )
  }
}

export default PersonalFiles

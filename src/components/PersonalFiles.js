import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ModalsContainer from '../containers/ModalsContainer'
import { bytesToSize } from '../common'

const Store = window.require('electron-store')

import './ViewSwitcher.css'

class PersonalFiles extends Component {

  constructor(props) {
    super(props)
    this.onSearchInputChange = this.onSearchInputChange.bind(this)
    this.selectFile = this.selectFile.bind(this)
    this.isSelected = this.isSelected.bind(this)
    this.refresh = this.refresh.bind(this)
    this.handleCancelRestore = this.handleCancelRestore.bind(this)
    this.handleValidateRestore = this.handleValidateRestore.bind(this)
    this.store = new Store()
    this.state = {
      searchTerm: '',
      matchingFiles: [],
      target_directory: '/',
      refresh: 0,
      lock: false,
    }
  }

  componentDidMount() {
    this.props.dispatch.init()
    clearInterval(this.interval)
    this.interval = setInterval(this.refresh, 250)
  }

  componentWillUnmount() {
    this.props.dispatch.end()
    clearInterval(this.interval)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.state.files !== this.props.state.files)
      this.setState(Object.assign(this.state, {lock: false}))

    if(nextProps.state.socket.loading && !this.props.state.socket.loading && nextProps.state.view.loading_animation)
      return true

    if(!nextState.lock && nextProps.state.view.loading_animation && !this.props.state.view.loading_animation)
      return true

    if(nextProps.state.breadcrumb[nextProps.state.breadcrumb.length - 1].route !== this.props.state.breadcrumb[this.props.state.breadcrumb.length - 1].route)
      return true

    var newFiles = []
    for (var i = nextProps.state.files.length - 1; i >= 0; i--) {
      newFiles.push([nextProps.state.files[i].path, nextProps.state.files[i].type])
    }
    var oldFiles = []
    for (i = this.props.state.files.length - 1; i >= 0; i--) {
      oldFiles.push([this.props.state.files[i].path, this.props.state.files[i].type])
    }
    if(newFiles.length !== oldFiles.length || (newFiles.length > 1 && newFiles.every(function(item, i) {return item[0] !== oldFiles[i][0] || item[1] !== oldFiles[i][1]})))
      return true

    var newSelectedFiles = []
    for (i = nextProps.state.selection.selected.length - 1; i >= 0; i--) {
      newSelectedFiles.push([nextProps.state.selection.selected[i].path, nextProps.state.selection.selected[i].type])
    }
    var oldSelectedFiles = []
    for (i = this.props.state.selection.selected.length - 1; i >= 0; i--) {
      oldSelectedFiles.push([this.props.state.selection.selected[i].path, this.props.state.selection.selected[i].type])
    }
    if(newSelectedFiles.length !== oldSelectedFiles.length || (newSelectedFiles.length > 1 && newSelectedFiles.every(function(item, i) {return item[0] !== oldSelectedFiles[i][0] || item[1] !== oldSelectedFiles[i][1]})))
      return true

    return false
  }

  refresh() {
    var new_refresh_state = 0
    if(this.state.refresh >= 12)
      new_refresh_state = 0
    else
      new_refresh_state = this.state.refresh + 1

    this.setState(Object.assign(this.state, {refresh: new_refresh_state}))

    if(this.state.target_directory === this.props.state.breadcrumb[this.props.state.breadcrumb.length - 1].route && new_refresh_state !== 1)
      return

    var animate = false
    var target_directory = this.props.state.breadcrumb[this.props.state.breadcrumb.length - 1].route
    if(this.state.target_directory !== target_directory) {
      target_directory = this.state.target_directory
      animate = true
    }
    if(!this.state.lock) {
      this.setState(Object.assign(this.state, {lock: true}))
      this.props.dispatch.listDir(target_directory, animate)
    }
  }

  onSearchInputChange(event, route) {
    var grep = function(what, where, callback) {
      console.log('onSearchInputChange')
      console.log(route)
      console.log(what)
      console.log(where)
      var exec = window.require('child_process').exec;
      where = where.replace(' ', '\\ ')
      console.log(where)
      exec('grep -l ' + what + ' ' + where + ' 2> /dev/null', function(err, stdin, stdout) {
        console.log('GREP')
        console.log(stdin)
        console.log(stdout)
        console.log(err)
        var results = stdin.split('\n')
        console.log('RES')
        console.log(results)
        console.log('RES2')
        results.pop()
        console.log(results)
        callback(results)
      });
    }

    var target = event.target.value

    console.log('SEARCH IN')
    if (target.toLowerCase() === '') {
      console.log('EMPTY TARGET')
      this.setState({
        matchingFiles: [],
        searchTerm: target.toLowerCase()
      })
    } else {
      if (!route.endsWith('/'))
        route += '/'
      grep(target, route + '*.txt', function(list) {
        this.setState({
          matchingFiles: list,
          searchTerm: target.toLowerCase()
        })
        console.log('MATCHING')
        console.log(list)
      }.bind(this))
    }
  }

  isSelected(file) {

    for(var i = 0; i < this.props.state.selection.selected.length; i++) {
      if(this.props.state.selection.selected[i].path === file.path) {
        // console.log(file.path + ' selected')
        return true
      }
    }
    return false
  }

  selectFile(event, file) {
    const selected = !this.isSelected(file)
    this.props.dispatch.selectFile(file, selected)
  }

  handleCancelRestore(event) {
    this.props.dispatch.restoring(false)
  }

  handleValidateRestore(event) {

  }

  render() {
    var files = this.props.state.files
    const selected = this.props.state.selection.selected
    const view = this.props.state.view
    const loading = this.props.state.socket.loading
    const loading_animation = this.props.state.view.loading_animation
    const breadcrumb = this.props.state.breadcrumb
    this.currentPath = breadcrumb[breadcrumb.length -1]
    const openFile = this.props.dispatch.openFile

    files.sort((a, b) => {
      if(a.type === 'folder' && b.type === 'file')
        return -1
      else if (a.type === 'file' && b.type === 'folder')
        return 1
      if (a.name > b.name)
        return 1
      if (b.name > a.name)
        return -1
      return 0
    })

    let displayedFiles = files.filter(file => {
      // console.log('filtre')
      // console.log(this.state.searchTerm)
      // console.log(this.state.matchingFiles)
      return this.state.searchTerm === '' || file.name.toLowerCase().includes(this.state.searchTerm) || this.state.matchingFiles.indexOf(file.mountpoint) !== -1
    })

    class IconFormatter extends React.Component {
      static propTypes = {
        file: PropTypes.object.isRequired
      }

      render() {
        const file = this.props.file
        var re = /(?:\.([^.]+))?$/
        var type = re.exec(file['name'])[1]
        const icons = {
          folder: 'fa-folder-o',
          file: 'fa-file-o',
          zip: 'fa-file-archive-o',
          mp3: 'fa-file-audio-o',
          py: 'fa-file-code-o',
          xls: 'fa-file-excel-o',
          jpg: 'fa-file-image-o',
          pdf: 'fa-file-pdf-o',
          txt: 'fa-file-text-o',
          avi: 'fa-file-video-o',
          doc: 'fa-file-word-o'
        }
        if (type === undefined || !(type in icons) || file['type'] === 'folder')
          type = file['type']
        return (
            <div className='icon'>
              <i className={'fa ' + icons[type]}/>
            </div>
        )
      }
    }

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

      const listFiles = displayedFiles.map((file) => {
        const details = file.type === 'file' ? bytesToSize(file['size']) : file.children.length + ' element' + (file.children.length > 1 ? 's' : '')
        const hidden = (selected.length === 0) ? 'hidden' : ''
        var selected_file = this.isSelected(file)
        return (
          <a key={file.path} onClick={(event) => {
            if(selected.length === 0) {
              if(file.type === 'folder') {
                this.setState(Object.assign(this.state, {target_directory: file.path}))
              } else {
                openFile(file)
              }
            } else {
              this.selectFile(event, file)
            }
            }}>
          <li className="file-item" id={file.path}>
            <input className={hidden} id={'select_' + file.path} name={file.path} type="checkbox" title={selected_file ? 'Deselect' : 'Select'} onClick={(event) => {this.selectFile(event, file); event.stopPropagation()}} checked={selected_file} readOnly/>
            <IconFormatter file={file}/>
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
            <input onKeyUp={(event) => this.onSearchInputChange(event, this.store.get('mountpoint', '') + this.currentPath.route)} placeholder="Search"/>
          </div>
          <div className="breadcrumb">
            <ul>
              <li>
                <div className="dropdown-content">
                {breadcrumb.map((path, i) => 
                  <button key={path.route} onClick={() => {this.setState(Object.assign(this.state, {target_directory: path.route}))}} className={`button path-button ${i === 0 ? 'first-path-button' : ''} ${(i + 1) === breadcrumb.length ? 'last-path-button' : ''}`}>{(i + 1) === breadcrumb.length ? <i className="fa fa-folder-open"/> : ''} {path.libelle}</button>
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

import React, { Component } from 'react'

import { bytesToSize, dateToUTC } from '../common'

import './Modals.css'

export class RenameModal extends Component {
  constructor(props) {
    super(props)
    this.state = { newName: this.props.file.name }

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({ [name]: value })
  }

  handleFocus(event) {
    const target = event.target
    const value = target.value

    target.setSelectionRange(0, value.lastIndexOf('.'))
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleSubmit(event) {
    const file = this.props.file
    const newName = this.state.newName
    const renameFile = this.props.renameFile

    event.preventDefault()
    renameFile(file, newName)
  }

  render() {
    const newName = this.state.newName

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>RENAME FILE</h3>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="modal-body">
              <label>
                Enter file name<br/>
                <input type="text" name="newName" value={newName} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
              </label>
            </div>
            <div className="modal-footer">
              <button onClick={this.handleCancel} className="button third-button">Cancel</button>
              <button type="submit" className="button main-button" value="Submit">OK</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export class CreateDirModal extends Component {
  constructor(props) {
    super(props)
    this.state = { newName: 'Untitled Folder' }

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({ [name]: value })
  }

  handleFocus(event) {
    event.target.select()
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleSubmit(event) {
    const path = this.props.path
    const newName = this.state.newName
    const createDir = this.props.createDir

    event.preventDefault()
    if(newName !== '') createDir(path, newName)
  }

  render() {
    const newName = this.state.newName

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>CREATE DIRECTORY</h3>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="modal-body">
              <label>
                Enter new directory name<br/>
                <input type="text" name="newName" value={newName} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
              </label>
            </div>
            <div className="modal-footer">
              <button onClick={this.handleCancel} className="button third-button">Cancel</button>
              <button type="submit" className="button main-button" value="Submit">OK</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export class SearchModal extends Component {
  constructor(props) {
    super(props)
    this.state = { name: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({ [name]: value })
  }

  handleFocus(event) {
    event.target.select()
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleSubmit(event) {
    const path = this.props.path
    const name = this.state.name
    const search = this.props.search

    event.preventDefault()
    if(name !== '') search(name)
  }

  render() {
    const name = this.state.name

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>SEARCH FILE</h3>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="modal-body">
              <label>
                Enter file name<br/>
              <input type="text" name="name" value={name} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
              </label>
            </div>
            <div className="modal-footer">
              <button onClick={this.handleCancel} className="button third-button">Cancel</button>
              <button type="submit" className="button main-button" value="Submit">Search</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export class RemoveModal extends Component {
  constructor(props) {
    super(props)

    this.handleCancel = this.handleCancel.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleDelete(event) {
    const file = this.props.file
    const removeFunc = this.props.removeFunc

    event.preventDefault()
    removeFunc(file)
  }

  render() {
    const title = this.props.title
    const name = this.props.file.name

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{title}</h3>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete <b>{name}</b> ?</p>
          </div>
          <div className="modal-footer">
            <button onClick={this.handleCancel} className="button third-button">Cancel</button>
            <button onClick={this.handleDelete} className="button main-button">Delete</button>
          </div>
        </div>
      </div>
    )
  }
}

export class RestoreModal extends Component {
  constructor(props) {
    super(props)

    this.handleCancel = this.handleCancel.bind(this)
    this.handleRestore = this.handleRestore.bind(this)
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleRestore(event) {
    const file = this.props.file
    const restoreFile = this.props.restoreFile

    event.preventDefault()
    restoreFile(file)
  }

  render() {
    const name = this.props.file.name

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>RESTORE FILE</h3>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to restore <b>{name}</b> ?</p>
          </div>
          <div className="modal-footer">
            <button onClick={this.handleCancel} className="button third-button">Cancel</button>
            <button onClick={this.handleRestore} className="button main-button">Restore</button>
          </div>
        </div>
      </div>
    )
  }
}

export class DetailsModal extends Component {
  constructor(props) {
    super(props)

    this.handleClose = this.handleClose.bind(this)
  }

  handleClose(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  render() {
    const file = this.props.file

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>DETAILS</h3>
          </div>
          <div className="modal-body">
            <label>Name<input type="text" value={file.name} readOnly/></label>
            <label>Path<input type="text" value={file.path} readOnly/></label>
            <label>Type<input type="text" value={file.type} readOnly/></label>
            { file.size && <label>Size<input type="text" value={bytesToSize(file.size)} readOnly/></label> }
            { file.children && <label>List directory contents<textarea value={file.children} readOnly/></label> }
            { file.created && <label>Created<input type="text" value={dateToUTC(file.created)} readOnly/></label> }
            { file.updated && <label>Updated<input type="text" value={dateToUTC(file.updated)} readOnly/></label> }
            { file.removed_date && <label>Removed<input type="text" value={dateToUTC(file.removed_date)} readOnly/></label> }
          </div>
          <div className="modal-footer">
            <button onClick={this.handleClose} className="button third-button">Close</button>
          </div>
        </div>
      </div>
    )
  }
}

export class RestoreVersionModal extends Component {
  constructor(props) {
    super(props)

    this.handleCancel = this.handleCancel.bind(this)
    this.handleRestore = this.handleRestore.bind(this)
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleRestore(event) {
    const version = this.props.version
    const restoreVersion = this.props.restoreVersion

    event.preventDefault()
    restoreVersion(version)
  }

  render() {
    const version = this.props.version

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>RESTORE VERSION</h3>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to restore this version (<b>V.{version}</b>) ?</p>
          </div>
          <div className="modal-footer">
            <button onClick={this.handleCancel} className="button third-button">Cancel</button>
            <button onClick={this.handleRestore} className="button main-button">Restore</button>
          </div>
        </div>
      </div>
    )
  }
}

const MODAL_COMPONENTS = Object.freeze({
  "renameModal": RenameModal,
  "createDirModal": CreateDirModal,
  "removeModal": RemoveModal,
  "restoreModal": RestoreModal,
  "detailsModal": DetailsModal,
  "restoreVersionModal": RestoreVersionModal,
  "searchModal": SearchModal
})

class Modals extends Component {
  render() {
    const modalType = this.props.modalType
    if(!modalType) return null

    const modalProps = this.props.modalProps
    const SpecificModal = MODAL_COMPONENTS[modalType]
    return <SpecificModal {...modalProps} />
  }
}

export default Modals

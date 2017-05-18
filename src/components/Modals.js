import React, { Component } from 'react'

import './Modals.css'

export class RenameModal extends Component {
  constructor(props) {
    super(props);
    this.state = { newName: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({ [name]: value })
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleSubmit(event) {
    const path = this.props.path
    const name = this.props.name
    const newName = this.state.newName
    const renameFile = this.props.renameFile

    event.preventDefault()
    renameFile(path, name, newName)
  }

  render() {
    const name = this.props.name
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
                <input type="text" name="newName" placeholder={name} value={newName} onChange={this.handleChange}/>
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
    super(props);
    this.state = { newName: 'Untitled Folder' }

    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({ [name]: value })
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
                <input type="text" name="newName" value={newName} onChange={this.handleChange}/>
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


const MODAL_COMPONENTS = Object.freeze({
  "renameModal": RenameModal,
  "createDirModal": CreateDirModal,
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

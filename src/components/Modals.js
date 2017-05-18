import React, { Component } from 'react'
import { Form, Control } from 'react-redux-form'

import './Modals.css'

export class RenameModal extends Component {
  render() {
    const path = this.props.path
    const name = this.props.name

    const renameFile = this.props.renameFile
    const hideModal = this.props.hideModal

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>RENAME FILE</h3>
          </div>
          <Form model="modalsForm.rename"
                onSubmit={(values) => renameFile(path, name, values['name'])}>
            <div className="modal-body">
              <label>Enter new document name</label><br/>
              <Control.text model="modalsForm.rename.name" />
            </div>
            <div className="modal-footer">
              <button onClick={hideModal} className="button third-button">Cancel</button>
              <button type="submit" className="button main-button">OK</button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

export class CreateDirModal extends Component {
  render() {
    const path = this.props.path

    const createDir = this.props.createDir
    const hideModal = this.props.hideModal

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>CREATE DIRECTORY</h3>
          </div>
          <Form model="modalsForm.createDir"
                onSubmit={(values) => createDir(path, values['name'])}>
            <div className="modal-body">
              <label>Enter new directory name</label><br/>
              <Control.text model="modalsForm.createDir.name" />
            </div>
            <div className="modal-footer">
              <button onClick={hideModal} className="button third-button">Cancel</button>
              <button type="submit" className="button main-button">OK</button>
            </div>
          </Form>
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

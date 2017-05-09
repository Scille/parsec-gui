import React, { Component } from 'react';
import { Form, Control } from 'react-redux-form';

import './Modals.css';

class RenameModal extends Component {
  render() {
    const path = this.props.path;
    const name = this.props.name;

    const socketRenameFile = this.props.socketRenameFile;
    const hideModal = this.props.hideModal;

    return (
      <div className="modal-content">
        <div className="modal-header">
          <h3>RENAME FILE</h3>
        </div>
        <Form model="modalsForm.rename"
              onSubmit={(values) => socketRenameFile(path, name, values['name'])}>
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
    );
  }
}

class CreateDirModal extends Component {
  render() {
    const path = this.props.path;

    const socketCreateDir = this.props.socketCreateDir;
    const hideModal = this.props.hideModal;

    return (
      <div className="modal-content">
        <div className="modal-header">
          <h3>RENAME FILE</h3>
        </div>
        <Form model="modalsForm.createDir"
              onSubmit={(values) => socketCreateDir(path, values['name'])}>
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
    );
  }
}


const MODAL_COMPONENTS = Object.freeze({
  "renameModal": RenameModal,
  "createDirModal": CreateDirModal,
});

class Modals extends Component {
  render() {
    const modalType = this.props.state.modal.modalType;
    if(!modalType) return null;

    const modalProps = this.props.state.modal.modalProps;
    const SpecificModal = MODAL_COMPONENTS[modalType];
    return <SpecificModal {...modalProps} />
  }
}

export default Modals;
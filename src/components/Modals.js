import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
const Store = window.require('electron-store')

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
    const name = this.state.name
    const searchFile = this.props.searchFile

    event.preventDefault()
    if(name !== '') searchFile(name)
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
    const files = this.props.files
    const removeFunc = this.props.removeFunc

    event.preventDefault()
    for (var i=0; i < files.length; i++) {
      removeFunc(files[i])
    }
  }

  render() {
    const title = this.props.title
    if(this.props.files.length > 1) {
      var name = this.props.files.length + ' items'
    } else {
      name = this.props.files[0].name
    }

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
            { file.size && <label>Size<input type="text" value={bytesToSize(file.size)} readOnly/></label> }
            { file.children && <label>List directory contents<textarea value={file.children} readOnly/></label> }
            { file.created && <label>Created<input type="text" value={dateToUTC(file.created)} readOnly/></label> }
            { file.updated && <label>Updated<input type="text" value={dateToUTC(file.updated)} readOnly/></label> }
            { file.removed_date && <label>Removed<input type="text" value={dateToUTC(file.removed_date)} readOnly/></label> }

            { file.size && <label>Storage location<img width='420px' src={require('../../public/map.png')} alt="map"/></label>}
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

export class ShareModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recipient: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleShare = this.handleShare.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({ [name]: value })
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleShare(event) {
    const path = this.props.path
    const share = this.props.sharePath
    const recipient = this.state.recipient
    if(recipient !== '') share(path.path, recipient)
  }

  render() {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>SHARE</h3>
          </div>
          <form onSubmit={this.handleShare}>
            <div className="modal-body">
              <label>
                Recipient<br/>
                <input type="text" name="recipient" value={this.state.recipient} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
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

export class HistoryModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      version: '',
      disabled: false,
      searchable: this.props.searchable,
      selectValue: '',
      clearable: true,
      rtl: false,
    }

    this.updateValue = this.updateValue.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  updateValue (newValue) {
    this.setState({
      selectValue: newValue,
    });
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleSubmit(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  render() {
    if (this.props.file.children) {
      const options = [
        {label: 'Version 3 - 29/11/2017 - 17h37', value: '3'},
        {label: 'Version 2 - 28/11/2017 - 11h02', value: '2'},
        {label: 'Version 1 - 28/11/2017 - 08h55', value: '1'},
      ]
      console.log(this.state.selectValue)
      var delta = ''
      if (this.state.selectValue === '1') {
        delta = <div>TODO 1 new changed deleted</div>
      } else if (this.state.selectValue === '2') {
        delta = <div>TODO 2 new changed deleted</div>
      } else if (this.state.selectValue === '3') {
        delta = <div>TODO 3 new changed deleted</div>
      }
      return (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>HISTORY</h3>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="modal-body">
                <label>
                  Version number: 3<br/><br/></label>
                <label>
                  Restore version<br/>
                </label>
                <Select
                  autoFocus
                  options={options}
                  simpleValue
                  clearable={this.state.clearable}
                  name="selected-version"
                  disabled={this.state.disabled}
                  value={this.state.selectValue}
                  onChange={this.updateValue}
                  rtl={this.state.rtl}
                  openOnClick={false}
                  searchable={this.state.searchable}
                />
              <br/>
              <label >
                 Include subfolders:<br/>
                 <Toggle
                   defaultChecked={true}
                   onChange={this.handleBaconChange} />
              </label>
              <br/><br/>
              {delta}
              </div>
              <div className="modal-footer">
                <button onClick={this.handleCancel} className="button third-button">Cancel</button>
                <button type="submit" className="button main-button" value="Submit">OK</button>
              </div>
            </form>
          </div>
        </div>
      )
    } else {
      const options = [
        {label: 'Version 4 - 29/11/2017 - 15h06 - 10Mo', value: '4'},
        {label: 'Version 3 - 23/11/2017 - 14h54- 12Mo', value: '3'},
        {label: 'Version 2 - 22/11/2017 - 09h24- 8Mo', value: '2'},
        {label: 'Version 1 - 20/11/2017 - 18h28- 1Mo', value: '1'},
      ]

      return (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>HISTORY</h3>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="modal-body">
                <label>
                  Version number: 5<br/><br/></label>
                <label>
                  Restore version<br/>
                </label>
                <Select
                  autoFocus
                  options={options}
                  simpleValue
                  clearable={this.state.clearable}
                  name="selected-version"
                  disabled={this.state.disabled}
                  value={this.state.selectValue}
                  onChange={this.updateValue}
                  rtl={this.state.rtl}
                  openOnClick={false}
                  searchable={this.state.searchable}
                />
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
}

export class SettingsModal extends Component {
  constructor(props) {
    super(props)
    this.store = new Store()
    this.state = {
      enable_mountpoint: this.store.get('enable_mountpoint', false),
      mountpoint: this.store.get('mountpoint', ''),
      enable_indexation: this.store.get('enable_indexation', false),
      local_cache_size: this.store.get('local_cache_size', '200'),
      old_versions_ratio: this.store.get('old_versions_ratio', '80'),
    }
    this.handleEnableMountpointChange = this.handleEnableMountpointChange.bind(this)
    this.handleMountpointChange = this.handleMountpointChange.bind(this)
    this.handleEnableIndexationChange = this.handleEnableIndexationChange.bind(this)
    this.handleLocalCacheSizeChange = this.handleLocalCacheSizeChange.bind(this)
    this.handleOldVersionsRatioChange = this.handleOldVersionsRatioChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEnableMountpointChange(event) {
    this.setState({enable_mountpoint: event.target.checked});
  }

  handleMountpointChange(event) {
    this.setState({mountpoint: event.target.value});
  }

  handleEnableIndexationChange(event) {
    this.setState({enable_indexation: event.target.checked});
  }

  handleLocalCacheSizeChange(event) {
    this.setState({local_cache_size: event.target.value});
  }

  handleOldVersionsRatioChange(event) {
    this.setState({old_versions_ratio: event.target.value});
  }

  handleCancel(event) {
    const hideModal = this.props.hideModal

    event.preventDefault()
    hideModal()
  }

  handleSubmit(event) {
    this.store.set('enable_mountpoint', this.state.enable_mountpoint)
    this.store.set('mountpoint', this.state.mountpoint)
    this.store.set('enable_indexation', this.state.enable_indexation)
    this.store.set('local_cache_size', this.state.local_cache_size)
    this.store.set('old_versions_ratio', this.state.old_versions_ratio)
    const hideModal = this.props.hideModal
    event.preventDefault()
    hideModal()
  }

  _addDirectory(node) {
    if (node) {
      node.directory = true;
      node.webkitdirectory = true;
    }
  }

  render() {
      return (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>SETTINGS</h3>
            </div>
            <div className="modal-body">
             <br/>
             <label>
                Automatically mount at startup:<br/>
                <Toggle
                  defaultChecked={this.state.enable_mountpoint}
                  onChange={this.handleEnableMountpointChange}/><br/><br/>
              </label>
              <label>
                Mountpoint:<br/>
                <input type="text" id="mountpoint" name="mountpoint" value={this.state.mountpoint} onChange={this.handleMountpointChange} /><br/><br/>
              </label>
              <label>
                Content indexation for search engine:<br/>
                <Toggle
                  defaultChecked={this.state.enable_indexation}
                  onChange={this.handleEnableIndexationChange}/><br/><br/>
              </label>
              <label>
                Local cache size:<br/>
                <input type="number" name="cache" value={this.state.local_cache_size} onChange={this.handleLocalCacheSizeChange}/> Mo<br/><br/>
              </label>
              <label>
                Max old versions size on total space ratio:<br/>
                <input type="number" name="ratio" value={this.state.old_versions_ratio} onChange={this.handleOldVersionsRatioChange}/> (%)<br/><br/>
              </label>
            </div>
            <div className="modal-footer">
              <button onClick={this.handleCancel} className="button third-button">Cancel</button>
              <button onClick={this.handleSubmit} type="submit" className="button main-button" value="Submit">OK</button>
            </div>
          </div>
        </div>
      )
  }
}

export class InviteUserModal extends Component {
  constructor(props) {
    super(props)
    this.state = { user: '' }

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
    const inviteUser = this.props.inviteUser
    const user = this.state.user

    if(user === '') {
      return
    }

    event.preventDefault()
    inviteUser(user)
  }

  render() {
    const user = this.state.user
    var token = ''
    if(this.props.user_invitation !== null)
      token = this.props.user_invitation.token
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>INVITE USER</h3>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="modal-body">
              <label>
                User<br/>
                <input type="text" name="user" value={user} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
              </label>
              {this.props.user_invitation !== null &&
                <label>
                  Token: {token}
                </label>
              }
            </div>
            <div className="modal-footer">
              <button onClick={this.handleCancel} className="button third-button">Close</button>
              {this.props.user_invitation === null &&
                <button type="submit" className="button main-button" value="Submit">Get Token</button>
              }
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export class DeclareDeviceModal extends Component {
  constructor(props) {
    super(props)
    this.state = { device: '', confirmation_token: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.listenEvents = this.listenEvents.bind(this)
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
    const endDeclareDevice = this.props.endDeclareDevice

    if(event !== null)
      event.preventDefault()
    if(this.props.device_declaration !== null)
      endDeclareDevice()
      clearInterval(this.interval)
    hideModal()
  }

  handleSubmit(event) {
    const declareDevice = this.props.declareDevice
    const device = this.state.device

    if(device === '') {
      return
    }

    event.preventDefault()
    declareDevice(device)
    this.interval = setInterval(this.listenEvents, 1000);
  }

  listenEvents() {
    const listenEvents = this.props.listenEvents
    const acceptDevice = this.props.acceptDevice
    const endDeclareDevice = this.props.endDeclareDevice
    if(this.props.device_declaration && this.props.device_declaration.token === undefined) {
      endDeclareDevice()
      clearInterval(this.interval)
    } else if(this.props.event_device_try_claim_listened && this.props.event_device_try_claim_listened.device_name === this.state.device) {
      acceptDevice(this.props.event_device_try_claim_listened.configuration_try_id)
      this.handleCancel(null)
    } else {
      listenEvents(false)
    }
  }

  render() {
    const device = this.state.device
    var token = ''
    if(this.props.device_declaration && this.props.device_declaration.token !== undefined)
      token = this.props.device_declaration.token
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>DECLARE DEVICE</h3>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="modal-body">
              {this.props.device_declaration && this.props.device_declaration.token !== undefined &&
                <label>
                  Device: {device}<br/><br/>
                </label>
              }
              {(this.props.device_declaration === null || this.props.device_declaration.token === undefined) &&
                <label>
                  Device<br/>
                  <input type="text" name="device" value={device} onChange={this.handleChange} onFocus={this.handleFocus} autoFocus/>
                </label>
              }
              {this.props.device_declaration && this.props.device_declaration.token !== undefined &&
                <label>
                  Token: {token}<br/><br/>
                  Waiting for "{this.state.device}" configuration try...
                </label>
              }
            </div>
            <div className="modal-footer">
              <button onClick={this.handleCancel} className="button third-button">Close</button>
              {this.props.device_declaration && this.props.device_declaration.token !== undefined && this.props.device_declaration.device_name === this.state.device

              }
              {(this.props.device_declaration === null || this.props.device_declaration.token === undefined) &&
                <button type="submit" className="button main-button" value="Submit">Get Token</button>
              }
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
  "removeModal": RemoveModal,
  "restoreModal": RestoreModal,
  "detailsModal": DetailsModal,
  "restoreVersionModal": RestoreVersionModal,
  "searchModal": SearchModal,
  "shareModal": ShareModal,
  "historyModal": HistoryModal,
  "settingsModal": SettingsModal,
  "inviteUserModal": InviteUserModal,
  "declareDeviceModal": DeclareDeviceModal,
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

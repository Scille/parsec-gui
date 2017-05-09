import React, { Component } from 'react';

import bytesToSize from '../common/common';

import ModalsContainer from '../containers/ModalsContainer';

import './ViewSwitcher.css';

class PersonalFiles extends Component {

  componentDidMount() {
    this.props.dispatch.socketConnect();
  }

  componentWillUnmount() {
    this.props.dispatch.socketEnd();
  }

  render() {
    const files = this.props.state.files;
    const listView = this.props.state.listView;
    const path = this.props.state.path;

    const socketListDir = this.props.dispatch.socketListDir;
    const socketCreateFiles = this.props.dispatch.socketCreateFiles;
    const socketRenameFile = this.props.dispatch.socketRenameFile;
    const socketCreateDir = this.props.dispatch.socketCreateDir;
    const switchView = this.props.dispatch.switchView;

    const showModal = this.props.dispatch.showModal;
    const hideModal = this.props.dispatch.hideModal;

    const createDirModal = {
      "path": path,
      "socketCreateDir": socketCreateDir,
      "hideModal": hideModal
    }

    const breadcrumbPath = path.split('/').map((item, i) => {
      if (item === '') {
        return (
          <li key={i}><a onClick={() => socketListDir()}>Home</a></li>
        );
      }
      const itemPath = path.split(item)[0].concat(item);
      return (
        <li key={i}><a onClick={() => socketListDir(itemPath)}>{item}</a></li>
      );
    });

    const listFiles = files.map((file, i) => {
      const icon = file['id'] !== null? 'fa fa-file-o' : 'fa fa-folder-o';
      const itemPath = file['id'] !== null? path : path.concat('/', file['name']);
      const renameModal = {
        "path": path,
        "name": file['name'],
        "socketRenameFile": socketRenameFile,
        "hideModal": hideModal
      }
      return (
        <li key={i}>
          <a onClick={() => socketListDir(itemPath)}>
            <div className="icon"><i className={icon}/></div>
            <div className="title">{file['name']}</div>
            <div className="details">{bytesToSize(file['size'])}</div>
          </a>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-h"/>
              <div className="dropdown-content">
                <a onClick={() => showModal('renameModal', renameModal)}><i className="fa fa-pencil-square-o"/> Rename</a>
                <a onClick={() => console.log("Share")}><i className="fa fa-user-plus"/> Share</a>
                <a onClick={() => console.log("Delete")}><i className="fa fa-trash-o"/> Delete</a>
              </div>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div className="view-switcher">
        <div className="header">
          <div className="title">Personal Files</div>
          <div className="breadcrumb">
            <ul>
              { breadcrumbPath }
            </ul>
          </div>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-v"/>
              <div className="dropdown-content">
                <div>Views</div>
                <a onClick={switchView}><i className={!listView ? 'fa fa-th-large' : 'fa fa-th-list'}/>{!listView ? ' Grid' : ' List'}</a>
                <div>Actions</div>
                <a onClick={() => socketListDir(path)}><i className="fa fa-refresh"/> Refresh</a>
                <a onClick={() => showModal('createDirModal', createDirModal)}><i className="fa fa-folder"/> New Folder</a>
                <a>
                  <i className="fa fa-file"/>
                  <input type="file" name="file" id="file" className="input-file" onChange={(event) => {socketCreateFiles(path, event.target.files, event.target.result)}} multiple/>
                  <label htmlFor="file"> Add File</label>
                </a>
              </div>
            </div>
          </div>
      	</div>
        <div className={listView ? 'file-view grid-view' : 'file-view list-view'}>
          <ul>
            { listFiles }
          </ul>
        </div>

        <ModalsContainer></ModalsContainer>
      </div>
    );
  }
}

export default PersonalFiles;

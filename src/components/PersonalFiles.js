import React, { Component } from 'react';

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
    const switchView = this.props.dispatch.switchView;
    const addFile = this.props.dispatch.addFile;

    const breadcrumbPath = path.split('/').map((item, i) => {
      if (item === '') {
        return (
          <li key={i}><a href="#" onClick={() => socketListDir()}>Home</a></li>
        );
      }
      const itemPath = path.split(item)[0].concat(item);
      return (
        <li key={i}><a href="#" onClick={() => socketListDir(itemPath)}>{item}</a></li>
      );
    });

    const listFiles = files.map((file, i) => {
      const icon = file['id'] !== null? 'fa fa-file-o' : 'fa fa-folder-o';
      const itemPath = file['id'] !== null? path : path.concat('/', file['name']);
      return (
        <li key={i}>
          <a href="#" onClick={() => socketListDir(itemPath)}>
            <div className="icon"><i className={icon}/></div>
            <div className="title">{file['name']}</div>
            <div className="details">{file['detail']}</div>
          </a>
          <div className="options">
            <div className="dropdown">
              <i className="fa fa-ellipsis-h"/>
              <div className="dropdown-content">
                <a href="#" onClick={addFile}><i className="fa fa-pencil-square-o"/> Rename</a>
                <a href="#" onClick={addFile}><i className="fa fa-user-plus"/> Share</a>
                <a href="#" onClick={addFile}><i className="fa fa-trash-o"/> Delete</a>
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
                <a href="#" onClick={switchView}><i className={!listView ? 'fa fa-th-large' : 'fa fa-th-list'}/>{!listView ? ' Grid' : ' List'}</a>
                <div>Actions</div>
                <a href="#" onClick={() => socketListDir(path)}><i className="fa fa-refresh"/> Refresh</a>
                <a href="#" onClick={addFile}><i className="fa fa-folder"/> New Folder</a>
                <a href="#" onClick={addFile}><i className="fa fa-file"/> Add File</a>
              </div>
            </div>
          </div>
      	</div>
        <div className={listView ? 'file-view grid-view' : 'file-view list-view'}>
          <ul>
            { listFiles }
          </ul>
        </div>
      </div>
    );
  }
}

export default PersonalFiles;

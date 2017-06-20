import { saveAs, getPath } from '../common'
import * as types from './ActionTypes'
import FileReaderApi from '../api/fileReaderApi'
import NotifyApi from '../api/notifyApi'
import SocketApi from '../api/socketApi'

// VIEW
export const switchView = () => {
  return { type: types.SWITCH_VIEW }
}

// PATH
export const addPath = (path) => {
  return { type: types.ADD_PATH, path }
}
export const removePath = (index) => {
  return { type: types.REMOVE_PATH, index }
}

// MODAL
export const showModal = (modalType, modalProps) => {
  return { type: types.SHOW_MODAL, modalType, modalProps }
}
export const hideModal = () => {
  return { type: types.HIDE_MODAL }
}

// FILES
export const addFileSuccess = (file) => {
  return { type: types.ADD_FILE_SUCCESS, file }
}
export const deleteFileSuccess = (file) => {
  return { type: types.DELETE_FILE_SUCCESS, file }
}
export const updateFileSuccess = (path, updatedFile) => {
  return { type: types.UPDATE_FILE_SUCCESS, path, updatedFile }
}
export const loadFilesSuccess = (files) => {
  return { type: types.LOAD_FILES_SUCCESS, files }
}
export const loadFilesFailure = () => {
  return { type: types.LOAD_FILES_FAILURE }
}

// HISTORY
export const loadHistorySuccess = (history) => {
  return { type: types.LOAD_HISTORY_SUCCESS, history }
}
export const restoreVersionSuccess = () => {
  return { type: types.RESTORE_VERSION_SUCCESS }
}

// SOCKET
export const socketWrite = () => {
  return { type: types.SOCKET_WRITE }
}
export const socketWriteFailure = () => {
  return { type: types.SOCKET_WRITE_FAILURE }
}
export const socketConnectSuccess = () => {
  return { type: types.SOCKET_CONNECT_SUCCESS }
}
export const socketEndSuccess = () => {
  return { type: types.SOCKET_END_SUCCESS }
}
export const socketConnect = () => {
  return (dispatch) => {
    return SocketApi.connect()
      .then((data) => dispatch(socketConnectSuccess()))
      .catch((error) => {
        window.location.hash = '/socket-error'
        NotifyApi.notify(error.name, error.message)
      })
  }
}
export const socketEnd = () => {
  return (dispatch) => {
    SocketApi.end()
    dispatch(socketEndSuccess())
  }
}
export const socketListDir = (route) => {
  const Q = require('q')
  const cmd = `{"cmd": "stat", "path": "${route}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    const files = []
    return SocketApi.write(cmd)
      .then((data) => {
        if (data.type === 'folder') {
          data['children'].forEach((child) => {
            files.push({
              name: child,
              path: getPath(route, child),
            })
          })
          let chain = Q.when()
          files.forEach((file) => {
            chain = chain.then(() => {
              return SocketApi.write(`{"cmd": "stat", "path": "${file.path}"}\n`)
                .then((stat) => {
                  file = Object.assign(file, stat)
                })
            })
          })
          return chain
        }
        else return Promise.reject({label: 'Not a directory'})
      })
      .then(() => dispatch(loadFilesSuccess(files)))
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(loadFilesFailure())
      })
  }
}
export const socketShowDustbin = () => {
  const cmd = `{"cmd": "user_manifest_show_dustbin"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        const files = []
        data['dustbin'].forEach((file) => files.push({
          ...file,
          name: file.path.split('/').pop()
        }))
        dispatch(loadFilesSuccess(files))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(loadFilesFailure())
      })
  }
}
export const socketSearchFile = (name) => {
  const cmd = `{"cmd": "user_manifest_search_file", "name": "${name}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        const files = []
        dispatch(loadFilesSuccess(files))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(loadFilesFailure())
      })
  }
}
export const socketCreateFile = (route, fileR) => {
  return (dispatch) => {
    dispatch(socketWrite())
    let file = {
      name: fileR.name,
      path: route
    }
    let content = ""
    return FileReaderApi.read(fileR)
      .then((data) => {
        content = data
        const cmd = `{"cmd": "file_create", "path": "${route}"}\n`
        return SocketApi.write(cmd)
      })
      .then((data) => {
        const cmd = `{"cmd": "file_write", "path": "${route}", "content": "${content}"}\n`
        return SocketApi.write(cmd)
      })
      .then((data) => {
        NotifyApi.notify('Create', `'${route}' was added in your PARSEC forlder.`)
        return SocketApi.write(`{"cmd": "stat", "path": "${route}"}\n`)
      })
      .then((data) => {
        file = Object.assign(file, data)
        dispatch(addFileSuccess(file))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketRenameFile = (file, name) => {
  const path = file.path.replace(new RegExp(`${file.name}$`, 'g'), name)
  const cmd = `{"cmd": "move", "src": "${file.path}", "dst": "${path}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        NotifyApi.notify('Update', `'${file.path}' is renamed to '${path}'.`)
        const renamedFile = {
          ...file,
          name,
          path
        }
        dispatch(updateFileSuccess(file.path, renamedFile))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketDeleteFile = (file) => {
  const cmd = `{"cmd": "delete", "path": "${file.path}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        NotifyApi.notify('Delete', `'${file.path}' was removed from your PARSEC forlder.`)
        dispatch(deleteFileSuccess(file))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketRestoreFile = (file) => {
  const cmd = `{"cmd": "user_manifest_restore_file", "vlob": "${file.id}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        NotifyApi.notify('Restore', `'${file.path}' was added in your PARSEC forlder.`)
        dispatch(deleteFileSuccess(file))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketDownloadFile = (file) => {
  const cmd = `{"cmd": "file_read", "path": "${file.path}", "size": "${file.size}"}\n`
  return (dispatch) => {
    return SocketApi.write(cmd)
      .then((data) => {
        const buffer = new Buffer(data.content, 'base64')
        const blob = new Blob([buffer.toString()], { type: 'application/octet-binary' })
        const url = window.URL.createObjectURL(blob)
        saveAs(url, file.name)
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
      })
  }
}
export const socketCreateDir = (route, name) => {
  const path = getPath(route, name)
  const cmd = `{"cmd": "folder_create", "path": "${path}"}\n`
  let file = {
    name,
    path: route
  }
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        NotifyApi.notify('Create', `'${path}' was added in your PARSEC forlder.`)
        return SocketApi.write(`{"cmd": "stat", "path": "${path}"}\n`)
      })
      .then((data) => {
        file = Object.assign(file, data)
        dispatch(addFileSuccess(file))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketRemoveDir = (file) => {
  const cmd = `{"cmd": "delete", "path": "${file.path}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        NotifyApi.notify('Delete', `'${file.path}' was removed from your PARSEC forlder.`)
        dispatch(deleteFileSuccess(file))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketHistory = (summary=false) => {
  const cmd = `{"cmd": "user_manifest_history", "summary": "${summary}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => dispatch(loadHistorySuccess(data.detailed_history)))
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketRestoreVersion = (version) => {
  const cmd = `{"cmd": "user_manifest_restore", "version": "${version}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        window.location.hash = '/personal_files'
        NotifyApi.notify('Restore', `All files restored to the user_manifest's version V.${version}.`)
        dispatch(restoreVersionSuccess())
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}

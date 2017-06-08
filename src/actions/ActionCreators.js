import { saveAs, guid, getPath } from '../common'
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
export const updateFileSuccess = (file) => {
  return { type: types.UPDATE_FILE_SUCCESS, file }
}
export const loadFilesSuccess = (files) => {
  return { type: types.LOAD_FILES_SUCCESS, files }
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
        NotifyApi.notify('Error', error.label)
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
  const cmd = `{"cmd": "user_manifest_list_dir", "path": "${route}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    const files = []
    return SocketApi.write(cmd)
      .then((data) => {
        for(let [key, value] of Object.entries(data['children'])) {
          files.push({
            ...value,
            name: key,
            guid: guid(),
            path: getPath(route, key),
          })
        }
        let chain = Q.when()
        files.forEach((file) => {
          if(file.id)
            chain = chain.then(() => {
              return SocketApi.write(`{"cmd": "file_stat", "id": "${file.id}"}\n`)
                .then((stat) => {
                  file = Object.assign(file, stat)
                })
            })
        })
        return chain
      })
      .then(() => dispatch(loadFilesSuccess(files)))
      .catch((error) => {
        NotifyApi.notify('Error', error.toString())
        dispatch(socketWriteFailure())
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
          name: file.path.split('/').pop(),
          guid: guid()
        }))
        dispatch(loadFilesSuccess(files))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketCreateFile = (route, fileR) => {
  return (dispatch) => {
    dispatch(socketWrite())
    let file = {
      name: fileR.name,
      guid: guid(),
      path: route
    }
    return FileReaderApi.read(fileR)
      .then((data) => {
        const cmd = `{"cmd": "user_manifest_create_file", "path": "${route}", "content": "${data}"}\n`
        return SocketApi.write(cmd)
      })
      .then((data) => {
        file = Object.assign(file, data)
        NotifyApi.notify('Create', `'${route}' was added in your PARSEC forlder.`)
        return SocketApi.write(`{"cmd": "file_stat", "id": "${data.id}"}\n`)
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
  const cmd = `{"cmd": "user_manifest_rename_file", "old_path": "${file.path}", "new_path": "${path}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        NotifyApi.notify('Update', `'${file.path}' is renamed to '${path}'.`)
        file = {
          ...file,
          name,
          path
        }
        dispatch(updateFileSuccess(file))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketDeleteFile = (file) => {
  const cmd = `{"cmd": "user_manifest_delete_file", "path": "${file.path}"}\n`
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
  const cmd = `{"cmd": "file_read", "id": "${file.id}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        const buffer = new Buffer(data.content, 'base64')
        const blob = new Blob([buffer.toString()], { type: 'application/octet-binary' })
        const url = window.URL.createObjectURL(blob)
        saveAs(url, file.name)
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketCreateDir = (route, name) => {
  const path = getPath(route, name)
  const cmd = `{"cmd": "user_manifest_make_dir", "path": "${path}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        const file = {
          name,
          path,
          id: null,
          guid: guid()
        }
        NotifyApi.notify('Create', `'${file.path}' was added in your PARSEC forlder.`)
        dispatch(addFileSuccess(file))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketRemoveDir = (file) => {
  const cmd = `{"cmd": "user_manifest_remove_dir", "path": "${file.path}"}\n`
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

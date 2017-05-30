import { saveAs, guid } from '../common'
import * as types from './ActionTypes'
import SocketApi from '../api/socketApi'
import notifyApi from '../api/notifyApi'


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

// SOCKET
export const socketWrite = () => {
  return { type: types.SOCKET_WRITE }
}
export const socketWriteSuccess = () => {
  return { type: types.SOCKET_WRITE_SUCCESS }
}
export const socketWriteFailure = () => {
  return { type: types.SOCKET_WRITE_FAILURE }
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
            path: route === '/' ? route.concat(key) : route.concat('/', key),
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
      .then(() => {
        dispatch(loadFilesSuccess(files))
        dispatch(socketWriteSuccess())
      })
      .catch((error) => {
        notifyApi.notify('Error', error.label)
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
        dispatch(socketWriteSuccess())
      })
      .catch((error) => {
        notifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketCreateFile = (route, fileR) => {
  return (dispatch) => {
    dispatch(socketWrite())
    const reader = new FileReader()
    let file = {
      name: fileR.name,
      guid: guid(),
      path: route
    }
    reader.readAsDataURL(fileR)
    reader.onload = () => {
      const cmd = `{"cmd": "user_manifest_create_file", "path": "${route}", "content": "${reader.result.split(',')[1]}"}\n`
      return SocketApi.write(cmd)
        .then((data) => {
          file = Object.assign(file, data)
          notifyApi.notify('Create', `'${route}' was added in your PARSEC forlder.`)
          return SocketApi.write(`{"cmd": "file_stat", "id": "${data.id}"}\n`)
        })
        .then((data) => {
          file = Object.assign(file, data)
          dispatch(addFileSuccess(file))
          dispatch(socketWriteSuccess())
        })
        .catch((error) => {
          notifyApi.notify('Error', error.label)
          dispatch(socketWriteFailure())
        })
    }
    reader.onerror = (evt) => alert("Error reading file")
  }
}
export const socketRenameFile = (guid, route, name, newName) => {
  const actualRoute = route === '/' ? route.concat(name) : route.concat('/', name)
  const newRoute = route === '/' ? route.concat(newName) : route.concat('/', newName)
  const cmd = `{"cmd": "user_manifest_rename_file", "old_path": "${actualRoute}", "new_path": "${newRoute}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        const file = {
          guid,
          name: newName,
          path: newRoute
        }
        notifyApi.notify('Update', `'${actualRoute}' is renamed to '${newRoute}'.`)
        dispatch(updateFileSuccess(file))
        dispatch(socketWriteSuccess())
      })
      .catch((error) => {
        notifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketDeleteFile = (guid, route) => {
  const cmd = `{"cmd": "user_manifest_delete_file", "path": "${route}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        const file = { guid }
        notifyApi.notify('Delete', `'${route}' was removed from your PARSEC forlder.`)
        dispatch(deleteFileSuccess(file))
        dispatch(socketWriteSuccess())
      })
      .catch((error) => {
        notifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketRestoreFile = (id, guid, route) => {
  const cmd = `{"cmd": "user_manifest_restore", "vlob": "${id}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        const file = { guid }
        notifyApi.notify('Restore', `'${route}' was added in your PARSEC forlder.`)
        dispatch(deleteFileSuccess(file))
        dispatch(socketWriteSuccess())
      })
      .catch((error) => {
        notifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketDownloadFile = (id, name) => {
  const cmd = `{"cmd": "file_read", "id": "${id}"}\n`
  return (dispatch) => {
    return SocketApi.write(cmd)
      .then((data) => {
        const buffer = new Buffer(data.content, 'base64')
        const blob = new Blob([buffer.toString()], { type: 'application/octet-binary' })
        const url = window.URL.createObjectURL(blob)
        saveAs(url, name)
      })
      .catch((error) => {
        notifyApi.notify('Error', error.label)
      })
  }
}
export const socketCreateDir = (route, name) => {
  const newRoute = route === '/' ? route.concat(name) : route.concat('/', name)
  const cmd = `{"cmd": "user_manifest_make_dir", "path": "${newRoute}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        const file = {
          name,
          guid: guid(),
          path: newRoute
        }
        notifyApi.notify('Create', `'${newRoute}' was added in your PARSEC forlder.`)
        dispatch(addFileSuccess(file))
        dispatch(socketWriteSuccess())
      })
      .catch((error) => {
        notifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketRemoveDir = (guid, route) => {
  const cmd = `{"cmd": "user_manifest_remove_dir", "path": "${route}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        const file = { guid }
        notifyApi.notify('Delete', `'${route}' was removed from your PARSEC forlder.`)
        dispatch(deleteFileSuccess(file))
        dispatch(socketWriteSuccess())
      })
      .catch((error) => {
        notifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}

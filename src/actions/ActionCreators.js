import { getPath } from '../common'
import * as types from './ActionTypes'
import FileReaderApi from '../api/fileReaderApi'
import NotifyApi from '../api/notifyApi'
import SocketApi from '../api/socketApi'

// VIEW
export const loadingAnimation = (state) => {
  if(state)
    return { type: types.ENABLE_LOADING_ANIMATION }
  else
    return { type: types.DISABLE_LOADING_ANIMATION }
}
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
export const openFileSuccess = (mountpoint) => {
  return { type: types.OPEN_FILE_SUCCESS, mountpoint }
}
export const openFileFailure = (mountpoint) => {
  return { type: types.OPEN_FILE_FAILURE, mountpoint }
}
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

// SIGNUP
export const signupSuccess = (identity) => {
  return { type: types.SIGNUP_SUCCESS, identity }
}
export const signupFailure = (identity) => {
  return { type: types.SIGNUP_FAILURE, identity }
}

// LOGIN
export const loginSuccess = (identity) => {
  return { type: types.LOGIN_SUCCESS, identity }
}
export const loginFailure = (identity) => {
  return { type: types.LOGIN_FAILURE, identity }
}

// LOGGED
export const loggedSuccess = () => {
  return { type: types.LOGGED_SUCCESS }
}
export const loggedFailure = () => {
  return { type: types.LOGGED_FAILURE }
}

// LOGOUT
export const logoutSuccess = () => {
  return { type: types.LOGOUT_SUCCESS }
}
export const logoutFailure = () => {
  return { type: types.LOGOUT_FAILURE }
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
export const socketSignup = (identity, password) => {
  const cmd = `{"cmd": "identity_signup", "id": "${identity}", "password": "${password}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        NotifyApi.notify('Signup', `'${identity}' successfully signed up.`)
        dispatch(signupSuccess(identity))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketLogin = (identity, password) => {
  const cmd = `{"cmd": "identity_login", "id": "${identity}", "password": "${password}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        NotifyApi.notify('Login', `'${identity}' successfully logged in.`)
        dispatch(loginSuccess(identity))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        if(error['status'] === 'privkey_not_found')
          dispatch(loginFailure())
        else
          dispatch(socketWriteFailure())
      })
  }
}
export const socketLogged = () => {
  const cmd = `{"cmd": "identity_info"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        if(data['loaded'] === true)
          dispatch(loggedSuccess())
        else
          dispatch(loggedFailure())
      })
      .catch((error) => {
        dispatch(socketWriteFailure())
      })
  }
}
export const socketLogout = () => {
  const cmd = `{"cmd": "identity_unload"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        NotifyApi.notify('Logout', `Successfully logged out.`)
        dispatch(logoutSuccess())
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        if(error['status'] === 'identity_not_loaded')
          dispatch(logoutFailure())
        else
          dispatch(socketWriteFailure())
      })
  }
}
export const openFile = (file) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      if(file.mountpoint) {
        const new_process = window.require('child_process').spawn
        const open_file = new_process('xdg-open', [file.mountpoint])
        open_file.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`)
        })
        open_file.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`)
        })
        open_file.on('close', (code) => {
          if(code === 0) {
            dispatch(openFileSuccess(file.mountpoint))
            resolve(file.mountpoint)
          } else {
            NotifyApi.notify('Error', 'Unable to open the file.')
            console.log(`child process exited with code ${code}`)
            dispatch(openFileFailure(file.mountpoint))
            reject(file.mountpoint)
          }
        })
      } else {
        NotifyApi.notify('Error', 'Mountpoint not available.')
        dispatch(openFileFailure(file.mountpoint))
        reject(file.mountpoint)
      }
    }).catch(() => {})
  }
}
export const socketListDir = (route, animation) => {
  const Q = require('q')
  const cmd = `{"cmd": "stat", "path": "${route}"}\n`
  return (dispatch) => {
    dispatch(loadingAnimation(animation))
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
      .then(() => dispatch(loadingAnimation(true)))
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
        NotifyApi.notify('Create', `'${route}' was added in your PARSEC folder.`)
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
        NotifyApi.notify('Delete', `'${file.path}' was removed from your PARSEC folder.`)
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
        NotifyApi.notify('Restore', `'${file.path}' was added in your PARSEC folder.`)
        dispatch(deleteFileSuccess(file))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
      })
  }
}
export const socketMoveFile = (file, path) => {
  const newPath = path === '/' ? path.concat(file.name) : path.concat('/', file.name)
  const cmd = `{"cmd": "move", "src": "${file.path}", "dst": "${newPath}"}\n`
  return (dispatch) => {
    dispatch(socketWrite())
    return SocketApi.write(cmd)
      .then((data) => {
        return SocketApi.write(`{"cmd": "stat", "path": "${path}"}\n`)
      })
      .then((data) => {
        NotifyApi.notify('Move', `'${file.path}' is moved to '${newPath}'.`)
        dispatch(deleteFileSuccess(file))
        dispatch(updateFileSuccess(path, data))
      })
      .catch((error) => {
        NotifyApi.notify('Error', error.label)
        dispatch(socketWriteFailure())
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
        NotifyApi.notify('Create', `'${path}' was added in your PARSEC folder.`)
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
        NotifyApi.notify('Delete', `'${file.path}' was removed from your PARSEC folder.`)
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

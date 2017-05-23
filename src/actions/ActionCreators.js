import * as types from './ActionTypes'

// SOCKET
export const socketConnect = (cmd) => {
  return { type: types.SOCKET_CONNECT, cmd }
}
export const socketEnd = () => {
  return { type: types.SOCKET_END }
}
export const socketListDir = (route) => {
  return { type: types.SOCKET_LIST_DIR, route }
}
export const socketShowDustbin = () => {
  return { type: types.SOCKET_SHOW_DUSTBIN }
}
export const socketCreateFile = (route, file) => {
  return { type: types.SOCKET_CREATE_FILE, route, file }
}
export const socketRenameFile = (actualRoute, newRoute) => {
  return { type: types.SOCKET_RENAME_FILE, actualRoute, newRoute }
}
export const socketDeleteFile = (route) => {
  return { type: types.SOCKET_DELETE_FILE, route }
}
export const socketRestoreFile = (id, route) => {
  return { type: types.SOCKET_RESTORE_FILE, id, route }
}
export const socketDownloadFile = (id, name) => {
  return { type: types.SOCKET_DOWNLOAD_FILE, id, name }
}
export const socketCreateDir = (route) => {
  return { type: types.SOCKET_CREATE_DIR, route }
}
export const socketRemoveDir = (route) => {
  return { type: types.SOCKET_REMOVE_DIR, route }
}

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

// FILES
export const updateFile = (file) => {
  return { type: types.UPDATE_FILE, file }
}
export const refreshFiles = (files) => {
  return { type: types.REFRESH_FILES, files }
}

// Modal
export const showModal = (modalType, modalProps) => {
  return { type: types.SHOW_MODAL, modalType, modalProps }
}
export const hideModal = () => {
  return { type: types.HIDE_MODAL }
}

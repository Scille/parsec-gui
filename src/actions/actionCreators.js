import * as types from './actionTypes'

// SOCKET
export const socketConnect = () => {
  return { type: types.SOCKET_CONNECT }
}
export const socketEnd = () => {
  return { type: types.SOCKET_END }
}
export const socketListDir = (route) => {
  return { type: types.SOCKET_LIST_DIR, route }
}
export const socketShowDustbin = (route) => {
  return { type: types.SOCKET_SHOW_DUSTBIN, route }
}
export const socketCreateFile = (route, file) => {
  return { type: types.SOCKET_CREATE_FILE, route, file }
}
export const socketRenameFile = (actualRoute, newRoute) => {
  return { type: types.SOCKET_RENAME_FILE, actualRoute, newRoute }
}
export const socketCreateDir = (route) => {
  return { type: types.SOCKET_CREATE_DIR, route }
}

// VIEW
export const switchView = () => {
  return { type: types.SWITCH_VIEW }
}

// PATH
export const addPath = (path) => {
  return { type: types.ADD_PATH, path }
}
export const slicePath = (index) => {
  return { type: types.SLICE_PATH, index }
}

// FILES
export const removeFile = (id) => {
  return { type: types.REMOVE_FILE, id }
}
export const updateFile = (id, file) => {
  return { type: types.UPDATE_FILE, id, file }
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

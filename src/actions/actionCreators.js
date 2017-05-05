import * as types from './actionTypes';

// SOCKET
export const socketConnect = () => {
  return { type: types.SOCKET_CONNECT }
}
export const socketEnd = () => {
  return { type: types.SOCKET_END }
}
export const socketListDir = (path) => {
  return { type: types.SOCKET_LIST_DIR, path }
}
export const socketCreateFile = (path, file) => {
  return { type: types.SOCKET_CREATE_FILE, path, file }
}
export const socketRenameFile = (path, name, newName) => {
  return { type: types.SOCKET_RENAME_FILE, path, name, newName }
}
export const socketCreateDir = (path, name) => {
  return { type: types.SOCKET_CREATE_DIR, path, name }
}

// VIEW
export const switchView = () => {
  return { type: types.SWITCH_VIEW }
}

// PATH
export const switchPath = (path) => {
  return { type: types.SWITCH_PATH, path }
}

// FILES
export const addFile = (file) => {
  return { type: types.ADD_FILE, file }
}
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

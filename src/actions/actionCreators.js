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
export const deleteFile = (file) => {
  return { type: types.DELETE_FILE, file }
}
export const moveFile = (file) => {
  return { type: types.MOVE_FILE, file }
}
export const renameFile = (file) => {
  return { type: types.RENAME_FILE, file }
}
export const refreshFiles = (files) => {
  return { type: types.REFRESH_FILES, files }
}

import * as types from './actionTypes';

export const addFile = (file) => {
  return { type: types.ADD_FILE, file }
}

export const deleteFile = (file) => {
  return { type: types.DELETE_FILE, file }
}

export const moveFile = (file) => {
  return { type: types.MOVE_FILE, file }
}

export const refreshFiles = (path) => {
  return { type: types.REFRESH_FILES, path }
}

export const renameFile = (file) => {
  return { type: types.RENAME_FILE, file }
}

export const switchView = () => {
  return { type: types.SWITCH_VIEW }
}

export const socketConnect = () => {
  return { type: types.SOCKET_CONNECT }
}

export const socketEnd = () => {
  return { type: types.SOCKET_END }
}

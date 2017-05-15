import * as types from '../actions/actionTypes'

const FileReducer = (state={}, action) => {
  switch (action.type) {
    case types.UPDATE_FILE:
      if (state.id !== action.file.id)
        return state
      return action.file
    default:
      return state
  }
}

const FilesReducer = (state=[], action) => {
  switch (action.type) {
    case types.UPDATE_FILE:
      return state.map(item => FileReducer(item, action))
    case types.REMOVE_FILE:
      return state.filter(item => item.id !== action.file.id)
    case types.REFRESH_FILES:
      return action.files
    default:
      return state
  }
}

export default FilesReducer

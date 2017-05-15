import * as types from '../actions/actionTypes'

const FilesReducer = (state=[], action) => {
  switch(action.type) {
    case types.UPDATE_FILE:
      return state.map(item => {
        if(item.id !== action.file.id) return item
        return Object.assign(item, action.file)
      })
    case types.REFRESH_FILES:
      return action.files
    default:
      return state
  }
}

export default FilesReducer

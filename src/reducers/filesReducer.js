import * as types from '../actions/ActionTypes'

const filesReducer = (state=[], action) => {
  switch(action.type) {
    case types.ADD_FILE_SUCCESS:
      return [
        ...state.filter(file => file.path !== action.file.path),
        Object.assign({}, action.file)
      ]
    case types.DELETE_FILE_SUCCESS:
      return state.filter(file => file.path !== action.file.path)
    case types.UPDATE_FILE_SUCCESS:
      return state.map(file => {
        if(file.path !== action.file.path) return file
        return Object.assign(file, action.file)
      })
    case types.LOAD_FILES_SUCCESS:
      return action.files
    default:
      return state
  }
}

export default filesReducer

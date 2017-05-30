import * as types from '../actions/ActionTypes'

const filesReducer = (state=[], action) => {
  switch(action.type) {
    case types.ADD_FILE_SUCCESS:
      return [
        ...state.filter(file => file.guid !== action.file.guid),
        Object.assign({}, action.file)
      ]
    case types.DELETE_FILE_SUCCESS:
      return state.filter(file => file.guid !== action.file.guid)
    case types.UPDATE_FILE_SUCCESS:
      return state.map(file => {
        if(file.guid !== action.file.guid) return file
        return Object.assign(file, action.file)
      })
    case types.LOAD_FILES_SUCCESS:
      return action.files
    default:
      return state
  }
}

export default filesReducer

import * as types from '../actions/ActionTypes'

const initialState = []

const filesReducer = (state=initialState, action) => {
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
        if(file.path !== action.path) return file
        return Object.assign(file, action.updatedFile)
      })
    case types.LOAD_FILES_SUCCESS:
      return action.files
    case types.LOAD_FILES_FAILURE:
      return initialState
    default:
      return state
  }
}

export default filesReducer

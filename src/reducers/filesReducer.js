import * as types from '../actions/ActionTypes'

const filesReducer = (state=[], action) => {
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

export default filesReducer

import * as types from '../actions/ActionTypes'

const historyReducer = (state=[], action) => {
  switch(action.type) {
    case types.LOAD_HISTORY_SUCCESS:
      return action.history
    default:
      return state
  }
}

export default historyReducer

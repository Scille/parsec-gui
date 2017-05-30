import * as types from '../actions/ActionTypes';

const socketReducer = (state=false, action) => {
  switch(action.type) {
    case types.SOCKET_WRITE:
      return true
    case types.SOCKET_WRITE_SUCCESS:
    case types.SOCKET_WRITE_FAILURE:
      return false
    default:
      return state
  }
}

export default socketReducer

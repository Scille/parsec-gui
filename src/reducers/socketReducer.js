import * as types from '../actions/ActionTypes';

const initialState = {
  connected: false,
  loading: false
}

const socketReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.SOCKET_WRITE:
      return {
        ...state,
        loading: true
      }
    case types.SOCKET_CONNECT_SUCCESS:
      return {
        ...state,
        connected: true
      }
    case types.LOAD_FILES_SUCCESS:
    case types.UPDATE_FILE_SUCCESS:
    case types.DELETE_FILE_SUCCESS:
    case types.ADD_FILE_SUCCESS:
    case types.LOAD_HISTORY_SUCCESS:
    case types.RESTORE_VERSION_SUCCESS:
    case types.SOCKET_WRITE_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}

export default socketReducer

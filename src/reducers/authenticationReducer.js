import * as types from '../actions/ActionTypes';

const initialState = {
  authenticated: false,
  logins: [],
  fs_pid: null,
  user_invitation: null,
  device_declaration: null,
  device_try_claim_submitted: null
}

const authenticationReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.CONFIGURE_DEVICE_CLEAR:
      return {
        ...state,
        device_try_claim_submitted: null,
      }
    case types.CONFIGURE_DEVICE_SUCCESS:
      return {
        ...state,
        device_try_claim_submitted: action.type,
      }
    case types.CONFIGURE_DEVICE_FAILURE:
      return {
        ...state,
        device_try_claim_submitted: action.error,
      }
    case types.LIST_LOGINS_SUCCESS:
      return {
        ...state,
        logins: action.logins,
      }
    case types.LIST_LOGINS_FAILURE:
    case types.SIGNUP_SUCCESS:
    case types.SIGNUP_FAILURE:
    case types.LOGIN_FAILURE:
    case types.LOGGED_FAILURE:
    case types.LOGOUT_SUCCESS:
    case types.LOGOUT_FAILURE:
      return {
        ...state,
        authenticated: false,
      }
    case types.LOGIN_SUCCESS:
    case types.LOGGED_SUCCESS:
      return {
        ...state,
        authenticated: true,
      }
    case types.MOUNT_FILESYSTEM_SUCCESS:
      return {
        ...state,
        fs_pid: action.fs_pid,
      }
    default:
      return state
  }
}

export default authenticationReducer

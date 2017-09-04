import * as types from '../actions/ActionTypes';

const initialState = {
  authenticated: false
}

const authenticationReducer = (state=initialState, action) => {
  switch(action.type) {
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
    default:
      return state
  }
}

export default authenticationReducer
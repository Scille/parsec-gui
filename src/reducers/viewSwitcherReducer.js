import * as types from '../actions/ActionTypes';

const initialState = {
  list: true,
  loading_animation: true,
  restoring: false
}

const viewSwitcherReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.SWITCH_VIEW:
      return {
      	...state,
      	list: !state.list
      }
    case types.ENABLE_LOADING_ANIMATION:
      return {
      	...state,
        loading_animation: true
      }
    case types.DECLARE_DEVICE_SUCCESS:
    case types.DECLARE_DEVICE_FAILURE:
    case types.INVITE_USER_SUCCESS:
    case types.INVITE_USER_FAILURE:
    case types.DISABLE_LOADING_ANIMATION:
      return {
      	...state,
        loading_animation: false
      }
    case types.ENABLE_RESTORING:
      return {
        ...state,
        restoring: true
      }
    case types.DISABLE_RESTORING:
      return {
        ...state,
        restoring: false
      }
    default:
      return state
  }
}

export default viewSwitcherReducer

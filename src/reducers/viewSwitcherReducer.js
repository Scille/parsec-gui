import * as types from '../actions/ActionTypes';

const initialState = {
  list: true,
  loading_animation: true
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
    case types.DISABLE_LOADING_ANIMATION:
      return {
      	...state,
        loading_animation: false
      }
    default:
      return state
  }
}

export default viewSwitcherReducer

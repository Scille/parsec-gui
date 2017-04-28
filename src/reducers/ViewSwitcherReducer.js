import * as types from '../actions/actionTypes';

const initState = false

const viewSwitcherReducer = (state = initState, action) => {
  switch (action.type) {
    case types.SWITCH_VIEW:
      return !state
    default:
      return state
  }
}

export default viewSwitcherReducer;

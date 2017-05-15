import * as types from '../actions/actionTypes';

const viewSwitcherReducer = (state=false, action) => {
  switch(action.type) {
    case types.SWITCH_VIEW:
      return !state
    default:
      return state
  }
}

export default viewSwitcherReducer;

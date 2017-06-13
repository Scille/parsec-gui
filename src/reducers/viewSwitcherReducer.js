import * as types from '../actions/ActionTypes';

const viewSwitcherReducer = (state=true, action) => {
  switch(action.type) {
    case types.SWITCH_VIEW:
      return !state
    default:
      return state
  }
}

export default viewSwitcherReducer

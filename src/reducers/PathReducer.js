import * as types from '../actions/actionTypes';

const pathReducer = (state='', action) => {
  switch (action.type) {
    case types.SWITCH_PATH:
      return action.path;
    default:
      return state;
  }
}

export default pathReducer;

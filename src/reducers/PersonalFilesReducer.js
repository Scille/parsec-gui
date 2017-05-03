import * as types from '../actions/actionTypes';

const personalFile = (state={}, action) => {
  switch (action.type) {
    case types.ADD_FILE:
      return action.file
    case types.UPDATE_FILE:
      if (state.id !== action.id)
        return state
      return {
        ...state,
        id: action.file.id,
        size: action.file.size
      }
    case types.REMOVE_FILE:
      return state.id !== action.file.id;
    default:
      return state
  }
}

const personalFilesReducer = (state=[], action) => {
  switch (action.type) {
    case types.ADD_FILE:
      return [
        ...state,
        personalFile(undefined, action)
      ]
    case types.UPDATE_FILE:
      return state.map(item => personalFile(item, action));
    case types.REMOVE_FILE:
      return state.filter(item => personalFile(item, action));
    case types.REFRESH_FILES:
      return action.files;
    default:
      return state;
  }
}

export default personalFilesReducer;

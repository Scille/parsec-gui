import * as types from '../actions/ActionTypes'

const initialState = {selected: [], cutted: [], path: ''}

const selectionReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.SELECT_FILE:
      return Object.assign({}, state, {
        selected: [
          ...state.selected.filter(file => file.path !== action.file.path),
          Object.assign({}, action.file)
        ]
      })
    case types.DELETE_FILE_SUCCESS:
    case types.DESELECT_FILE:
      return Object.assign({}, state, {
        selected: [
          ...state.selected.filter(file => file.path !== action.file.path)
        ]
      })
    case types.SET_PATH:
      if(state.path !== action.path) {
        return Object.assign({}, state, {
          selected: [],
          path: action.path
        })
      } else {
        return state
      }
    case types.CUT_FILES:
      return {
        cutted: state.selected,
        selected: [],
      }
    case types.UPDATE_FILE_SUCCESS:
    case types.UPDATE_FILE_FAILURE:
      return {
        cutted: [],
        selected: [],
      }
    default:
      return state
  }
}

export default selectionReducer

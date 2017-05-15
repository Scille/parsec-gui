import * as types from '../actions/actionTypes'

const initialState = [{ route: '/', libelle: 'Home' }]

const pathReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.ADD_PATH:
      return [
        ...state,
        action.path
      ]
    case types.SLICE_PATH:
      return state.slice(0, action.index + 1)
    default:
      return state
  }
}

export default pathReducer

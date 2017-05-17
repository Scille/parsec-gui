import * as types from '../actions/ActionTypes'

const initialState = [{ route: '/', libelle: 'Home' }]

const breadcrumbReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.ADD_PATH:
      return [
        ...state,
        action.path
      ]
    case types.REMOVE_PATH:
      return state.slice(0, action.index + 1)
    default:
      return state
  }
}

export default breadcrumbReducer

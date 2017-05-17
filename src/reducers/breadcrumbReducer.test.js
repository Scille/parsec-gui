import breadcrumbReducer from './breadcrumbReducer'
import * as types from '../actions/ActionTypes'

describe('Path Reducer', () => {
  const initialState = [{ route: '/', libelle: 'Home' }]

  it('should return the initial state', () => {
    expect(breadcrumbReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle ADD_PATH', () => {
    const state = [
      ...initialState,
      { route: '/dir', libelle: 'dir' }
    ]
    const newState = [
      ...state,
      { route: '/dir/sub-dir', libelle: 'sub-dir' }
    ]
    const path = { path: '/dir/sub-dir', libelle: 'sub-dir' }
    const action = {
      type: types.ADD_PATH,
      path: newState[newState.length - 1]
    }
    expect(breadcrumbReducer(state, action)).toEqual(newState)
  })
  it('should handle REMOVE_PATH', () => {
    const state = [
      ...initialState,
      { route: '/dir', libelle: 'dir' }
    ]
    const index = 0
    const action = {
      type: types.REMOVE_PATH,
      index
    }
    expect(breadcrumbReducer(state, action)).toEqual(initialState)
  })
})

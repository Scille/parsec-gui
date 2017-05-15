import pathReducer from './PathReducer'
import * as types from '../actions/actionTypes'

describe('Path Reducer', () => {
  const initialState = [{ route: '/', libelle: 'Home' }]

  it('should return the initial state', () => {
    expect(pathReducer(undefined, {})).toEqual(initialState)
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
    expect(pathReducer(state, action)).toEqual(newState)
  })
  it('should handle SLICE_PATH', () => {
    const state = [
      ...initialState,
      { route: '/dir', libelle: 'dir' }
    ]
    const index = 0
    const action = {
      type: types.SLICE_PATH,
      index
    }
    expect(pathReducer(state, action)).toEqual(initialState)
  })
})

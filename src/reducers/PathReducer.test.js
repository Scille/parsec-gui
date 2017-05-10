import pathReducer from './PathReducer'
import * as types from '../actions/actionTypes';

describe('Path Reducer', () => {
  const initialState = ''

  it('should return the initial state', () => {
    expect(pathReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle SWITCH_PATH', () => {
    const state = '/'
    const path = '/new-path'
    const action = {
      type: types.SWITCH_PATH,
      path
    }
    expect(pathReducer(undefined, action)).toEqual(path)
    expect(pathReducer(state, action)).toEqual(path)
  })
})

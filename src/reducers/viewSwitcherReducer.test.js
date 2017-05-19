import viewSwitcherReducer from './viewSwitcherReducer'
import * as types from '../actions/ActionTypes';

describe('ViewSwitcher Reducer', () => {
  const initialState = false

  it('should return the initial state', () => {
    expect(viewSwitcherReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle SWITCH_VIEW', () => {
    const state = false
    const action = { type: types.SWITCH_VIEW }
    expect(viewSwitcherReducer(undefined, action)).toEqual(true)
    expect(viewSwitcherReducer(state, action)).toEqual(!state)
  })
})
import viewSwitcherReducer from './viewSwitcherReducer'
import * as types from '../actions/ActionTypes';

describe('ViewSwitcher Reducer', () => {
  const initialState = {list: true, loading_animation: true}

  it('should return the initial state', () => {
    expect(viewSwitcherReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle SWITCH_VIEW', () => {
    const state = {list: true, loading_animation: true}
    const action = { type: types.SWITCH_VIEW }
    expect(viewSwitcherReducer(undefined, action)).toEqual({list: false, loading_animation: true})
    expect(viewSwitcherReducer(state, action)).toEqual({list: false, loading_animation: true})
  })
})

import historyReducer from './historyReducer'
import * as types from '../actions/ActionTypes'

describe('Path Reducer', () => {
  const initialState = []

  it('should return the initial state', () => {
    expect(historyReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle LOAD_HISTORY_SUCCESS', () => {
    const state = [
      {
        version: 1,
        entries: { added: {}, changed: {}, removed: {} },
        groups: { added: {}, changed: {}, removed: {} },
        dustbin: { added: [], removed: [] },
        versions: { added: {}, changed: {}, removed: {} }
      }
    ]
    const newState = [
      ...state,
      {
        version: 2,
        entries: { added: { ['/file.txt']: { id: 'file_id'} }, changed: {}, removed: {} },
        groups: { added: {}, changed: {}, removed: {} },
        dustbin: { added: [], removed: [] },
        versions: { added: { ['file_id']: 1 }, changed: {}, removed: {} }
      }
    ]
    const action = {
      type: types.LOAD_HISTORY_SUCCESS,
      history: newState
    }
    expect(historyReducer(state, action)).toEqual(newState)
  })
})

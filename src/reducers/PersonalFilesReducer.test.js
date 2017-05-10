import personalFilesReducer from './PersonalFilesReducer'
import * as types from '../actions/actionTypes';

describe('PersonalFiles Reducer', () => {
  const initialState = []

  it('should return the initial state', () => {
    expect(personalFilesReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle REFRESH_FILES', () => {
    const state = [{ id: '1', name: 'file1.txt', size: 0 }]
    const newState = [
      ...state,
      { id: '2', name: 'file2.txt', size: 0 }
    ]
    const action = {
      type: types.REFRESH_FILES,
      files: newState
    }
    expect(personalFilesReducer(undefined, action)).toEqual(newState)
    expect(personalFilesReducer(state, action)).toEqual(newState)
  })
  it('should handle UPDATE_FILE', () => {
    const state = [
      { id: '1', name: 'file1.txt', size: 0 },
      { id: '2', name: 'file2.txt', size: 0 }
    ]
    const newState = [
      { id: '1', name: 'updatefile.txt', size: 1024 },
      { id: '2', name: 'file2.txt', size: 0 }
    ]
    const action = {
      type: types.UPDATE_FILE,
      id: newState[0].id,
      file: newState[0]
    }
    expect(personalFilesReducer(undefined, action)).toEqual(initialState)
    expect(personalFilesReducer(state, action)).toEqual(newState)
  })
})

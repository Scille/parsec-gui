import FilesReducer from './FilesReducer'
import * as types from '../actions/actionTypes'

describe('Files Reducer', () => {
  const initialState = []

  it('should return the initial state', () => {
    expect(FilesReducer(undefined, {})).toEqual(initialState)
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
    expect(FilesReducer(state, action)).toEqual(newState)
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
    expect(FilesReducer(state, action)).toEqual(newState)
  })
})
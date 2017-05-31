import filesReducer from './filesReducer'
import * as types from '../actions/ActionTypes'

describe('Files Reducer', () => {
  const initialState = []

  it('should return the initial state', () => {
    expect(filesReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle ADD_FILE_SUCCESS', () => {
    const state = [
      { id: '1',  guid: 'file1', name: 'file1.txt', size: 0 }
    ]
    const newState = [
      { id: '1',  guid: 'file1', name: 'file1.txt', size: 0 },
      { id: '2',  guid: 'file2', name: 'file2.txt', size: 0 }
    ]
    const action = {
      type: types.ADD_FILE_SUCCESS,
      file: newState[1]
    }
    expect(filesReducer(state, action)).toEqual(newState)
  })
  it('should handle DELETE_FILE_SUCCESS', () => {
    const state = [
      { id: '1',  guid: 'file1', name: 'file1.txt', size: 0 },
      { id: '2',  guid: 'file2', name: 'file2.txt', size: 0 }
    ]
    const newState = [
      { id: '1',  guid: 'file1', name: 'file1.txt', size: 0 }
    ]
    const action = {
      type: types.DELETE_FILE_SUCCESS,
      file: state[1]
    }
    expect(filesReducer(state, action)).toEqual(newState)
  })
  it('should handle UPDATE_FILE_SUCCESS', () => {
    const state = [
      { id: '1',  guid: 'file1', name: 'file1.txt', size: 0 },
      { id: '2',  guid: 'file2', name: 'file2.txt', size: 0 }
    ]
    const newState = [
      { id: '1',  guid: 'file1', name: 'updatefile.txt', size: 1024 },
      { id: '2',  guid: 'file2', name: 'file2.txt', size: 0 }
    ]
    const action = {
      type: types.UPDATE_FILE_SUCCESS,
      file: newState[0]
    }
    expect(filesReducer(state, action)).toEqual(newState)
  })
  it('should handle LOAD_FILES_SUCCESS', () => {
    const state = [{ id: '1',  guid: 'file1', name: 'file1.txt', size: 0 }]
    const newState = [
      ...state,
      { id: '2', name: 'file2.txt', size: 0 }
    ]
    const action = {
      type: types.LOAD_FILES_SUCCESS,
      files: newState
    }
    expect(filesReducer(state, action)).toEqual(newState)
  })
})

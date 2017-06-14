import filesReducer from './filesReducer'
import * as types from '../actions/ActionTypes'

describe('Files Reducer', () => {
  const initialState = []
  const fullState = [
    {
      name: "file.txt",
      path: "/file.txt",
      size: 244,
      type: "file",
      created: "2017-01-01T00:00:00+00:00",
      updated: "2017-01-01T00:00:00+00:00",
    },
    {
      name: "file2.txt",
      path: "/file2.txt",
      size: 244,
      type: "file",
      created: "2017-01-01T00:00:00+00:00",
      updated: "2017-01-01T00:00:00+00:00",
    }
  ]

  it('should return the initial state', () => {
    expect(filesReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle ADD_FILE_SUCCESS', () => {
    const state = fullState.slice(0, 1)
    const newState = fullState
    const action = {
      type: types.ADD_FILE_SUCCESS,
      file: newState[1]
    }
    expect(filesReducer(state, action)).toEqual(newState)
  })
  it('should handle DELETE_FILE_SUCCESS', () => {
    const state = fullState
    const newState = fullState.slice(0, 1)
    const action = {
      type: types.DELETE_FILE_SUCCESS,
      file: state[1]
    }
    expect(filesReducer(state, action)).toEqual(newState)
  })
  it('should handle UPDATE_FILE_SUCCESS', () => {
    const state = fullState
    let newState = fullState
    newState[0].name = 'update.txt'
    newState[0].path = '/update.txt'
    const action = {
      type: types.UPDATE_FILE_SUCCESS,
      path: state[0].path,
      file: newState[0]
    }
    expect(filesReducer(state, action)).toEqual(newState)
  })
  it('should handle LOAD_FILES_SUCCESS', () => {
    const state = []
    const newState = fullState
    const action = {
      type: types.LOAD_FILES_SUCCESS,
      files: newState
    }
    expect(filesReducer(state, action)).toEqual(newState)
  })
  it('should handle LOAD_FILES_FAILURE', () => {
    const state = fullState
    const newState = []
    const action = {
      type: types.LOAD_FILES_FAILURE,
    }
    expect(filesReducer(state, action)).toEqual(newState)
  })
})

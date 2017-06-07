import socketReducer from './socketReducer'
import * as types from '../actions/ActionTypes';

describe('SocketReducer Reducer', () => {
  const initialState = {
    connected: false,
    loading: false
  }

  it('should return the initial state', () => {
    expect(socketReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle SOCKET_WRITE', () => {
    const newState = { connected: false, loading: true }
    const action = { type: types.SOCKET_WRITE }
    expect(socketReducer(undefined, action)).toEqual(newState)
  })
  it('should handle LOAD_FILES_SUCCESS, UPDATE_FILE_SUCCESS, DELETE_FILE_SUCCESS, ADD_FILE_SUCCESS and SOCKET_WRITE_FAILURE', () => {
    const state = { connected: true, loading: true }
    const newState = {
      ...state,
      loading: false
    }
    const actions = [
      { type: types.LOAD_FILES_SUCCESS },
      { type: types.UPDATE_FILE_SUCCESS },
      { type: types.DELETE_FILE_SUCCESS },
      { type: types.ADD_FILE_SUCCESS },
      { type: types.SOCKET_WRITE_FAILURE }
    ]
    actions.forEach((action) => expect(socketReducer(state, action)).toEqual(newState))
  })
  it('should handle SOCKET_CONNECT_SUCCESS', () => {
    const newState = { connected: true, loading: false }
    const action = { type: types.SOCKET_CONNECT_SUCCESS }
    expect(socketReducer(undefined, action)).toEqual(newState)
  })
})

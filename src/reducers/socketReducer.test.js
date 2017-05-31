import socketReducer from './socketReducer'
import * as types from '../actions/ActionTypes';

describe('SocketReducer Reducer', () => {
  const initialState = false

  it('should return the initial state', () => {
    expect(socketReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle SOCKET_WRITE', () => {
    const action = { type: types.SOCKET_WRITE }
    expect(socketReducer(undefined, action)).toEqual(true)
    expect(socketReducer(true, action)).toEqual(true)
    expect(socketReducer(false, action)).toEqual(true)
  })
  it('should handle SOCKET_WRITE_SUCCESS', () => {
    const action = { type: types.SOCKET_WRITE_SUCCESS }
    expect(socketReducer(undefined, action)).toEqual(false)
    expect(socketReducer(true, action)).toEqual(false)
    expect(socketReducer(false, action)).toEqual(false)
  })
  it('should handle SOCKET_WRITE_FAILURE', () => {
    const action = { type: types.SOCKET_WRITE_FAILURE }
    expect(socketReducer(undefined, action)).toEqual(false)
    expect(socketReducer(true, action)).toEqual(false)
    expect(socketReducer(false, action)).toEqual(false)
  })
})

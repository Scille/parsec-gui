import modalReducer from './ModalReducer'
import * as types from '../actions/actionTypes'

describe('Modal Reducer', () => {
  const initialState = { modalType: null, modalProps: {} }

  it('should return the initial state', () => {
    expect(modalReducer(undefined, {})).toEqual(initialState)
  })
  it('should handle SHOW_MODAL', () => {
    const newState = {
      modalType: 'testModal',
      modalProps: { title: 'testModal' }
    }
    const action = {
      ...newState,
      type: types.SHOW_MODAL
    }
    expect(modalReducer(undefined, action)).toEqual(newState)
  })
  it('should handle HIDE_MODAL', () => {
    const state = {
      modalType: 'testModal',
      modalProps: { title: 'testModal' }
    }
    const action = { type: types.HIDE_MODAL }
    expect(modalReducer(state, action)).toEqual(initialState)
  })
})

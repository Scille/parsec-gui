import * as types from '../actions/actionTypes';

const initialState = {
  modalType: null,
  modalProps: {}
}

const modalReducer = (state=initialState, action) => {
  switch (action.type) {
    case types.SHOW_MODAL:
      return {
        modalType: action.modalType,
        modalProps: action.modalProps
      }
    case types.HIDE_MODAL:
      return initialState
    default:
      return state
  }
}

export default modalReducer;

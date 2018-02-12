import * as types from '../actions/ActionTypes';

const initialState = {
  modalType: null,
  modalProps: {}
}

const modalReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.DECLARE_DEVICE_SUCCESS:
      var newState = {
        ...state,
      }
      newState['modalProps']['device_declaration'] = {device: action.device, token: action.token}
      newState['refresh'] = Math.random()  // TODO Better way?
      return newState
    case types.INVITE_USER_SUCCESS:
      newState = {
        ...state,
      }
      newState['modalProps']['user_invitation'] = {user: action.user, token: action.token}
      newState['refresh'] = Math.random()  // TODO Better way?
      return newState
    case types.SHOW_MODAL:
      action.modalProps['device_declaration'] = null
      action.modalProps['user_invitation'] = null
      return {
        modalType: action.modalType,
        modalProps: action.modalProps,
      }
    case types.HIDE_MODAL:
      return initialState
    default:
      return state
  }
}

export default modalReducer

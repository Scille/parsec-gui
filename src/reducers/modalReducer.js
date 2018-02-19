import * as types from '../actions/ActionTypes';

const initialState = {
  modalType: null,
  modalProps: {}
}

const modalReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.EVENT_SUBSCRIBE_SUCCESS:
      if(action.event === 'device_try_claim_submitted') {
        var newState = {
          ...state,
        }
        newState['modalProps']['event_device_try_claim_subscribed'] = true
        newState['refresh'] = Math.random()  // TODO Better way?
        return newState
      } else {
        return state
      }
    case types.EVENT_UNSUBSCRIBE_SUCCESS:
      if(action.event === 'device_try_claim_submitted') {
        newState = {
          ...state,
        }
        newState['modalProps']['event_device_try_claim_subscribed'] = false
        newState['refresh'] = Math.random()  // TODO Better way?
        return newState
      } else {
        return state
      }
    case types.EVENT_LISTEN_SUCCESS:
      if(action.event.event === 'device_try_claim_submitted') {
        newState = {
          ...state,
        }
        newState['modalProps']['event_device_try_claim_listened'] = {device_name: action.event.device_name, configuration_try_id: action.event.configuration_try_id}
        newState['refresh'] = Math.random()  // TODO Better way?
        return newState
      } else {
        return state
      }
    case types.DECLARE_DEVICE_SUCCESS:
      newState = {
        ...state,
      }
      newState['modalProps']['device_declaration'] = {device: action.device, token: action.token}
      newState['refresh'] = Math.random()  // TODO Better way?
      return newState
    case types.DECLARE_DEVICE_FAILURE:
      newState = {
        ...state,
      }
      newState['modalProps']['device_declaration'] = action.error
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

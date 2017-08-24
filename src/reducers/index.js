import { combineReducers } from 'redux'

import breadcrumbReducer from './breadcrumbReducer'
import filesReducer from './filesReducer'
import historyReducer from './historyReducer'
import authenticationReducer from './authenticationReducer'
import modalReducer from './modalReducer'
import socketReducer from './socketReducer'
import viewSwitcherReducer from './viewSwitcherReducer'

const allReducers = combineReducers({
  authenticationReducer,
  breadcrumbReducer,
  filesReducer,
  historyReducer,
  modalReducer,
  socketReducer,
  viewSwitcherReducer
})

export default allReducers

import { combineReducers } from 'redux'

import breadcrumbReducer from './breadcrumbReducer'
import filesReducer from './filesReducer'
import historyReducer from './historyReducer'
import authenticationReducer from './authenticationReducer'
import modalReducer from './modalReducer'
import socketReducer from './socketReducer'
import selectionReducer from './selectionReducer'
import viewSwitcherReducer from './viewSwitcherReducer'

const allReducers = combineReducers({
  authenticationReducer,
  breadcrumbReducer,
  filesReducer,
  historyReducer,
  modalReducer,
  socketReducer,
  selectionReducer,
  viewSwitcherReducer
})

export default allReducers

import { combineReducers } from 'redux'

import breadcrumbReducer from './breadcrumbReducer'
import filesReducer from './filesReducer'
import historyReducer from './historyReducer'
import modalReducer from './modalReducer'
import socketReducer from './socketReducer'
import viewSwitcherReducer from './viewSwitcherReducer'

const allReducers = combineReducers({
  breadcrumbReducer,
  filesReducer,
  historyReducer,
  modalReducer,
  socketReducer,
  viewSwitcherReducer
})

export default allReducers

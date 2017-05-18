import { combineReducers } from 'redux'

import filesReducer from './filesReducer'
import viewSwitcherReducer from './viewSwitcherReducer'
import modalReducer from './modalReducer'
import breadcrumbReducer from './breadcrumbReducer'

const initialForm = { name: '' }

const allReducers = combineReducers({
  filesReducer,
  viewSwitcherReducer,
  modalReducer,
  breadcrumbReducer,
})

export default allReducers

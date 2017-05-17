import { combineReducers } from 'redux'
import { combineForms } from 'react-redux-form'

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
  modalsForm: combineForms({
    rename: initialForm,
    createDir: initialForm,
  }, 'modalsForm'),
})

export default allReducers

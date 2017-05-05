import { combineReducers } from 'redux';
import { combineForms } from 'react-redux-form';

import personalFilesReducer from './PersonalFilesReducer';
import viewSwitcherReducer from './ViewSwitcherReducer';
import modalReducer from './ModalReducer';
import pathReducer from './PathReducer';

const initialForm = {
  name: '',
};

const allReducers = combineReducers({
  personalFilesReducer,
  viewSwitcherReducer,
  modalReducer,
  pathReducer,
  modalsForm: combineForms({
    rename: initialForm,
    createDir: initialForm,
  }, 'modalsForm'),
})

export default allReducers;

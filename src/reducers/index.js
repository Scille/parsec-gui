import { combineReducers } from 'redux';

import personalFilesReducer from './PersonalFilesReducer';
import viewSwitcherReducer from './ViewSwitcherReducer';
import pathReducer from './PathReducer';

const allReducers = combineReducers({
  personalFilesReducer,
  viewSwitcherReducer,
  pathReducer
})

export default allReducers;

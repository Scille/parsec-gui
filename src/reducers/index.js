import { combineReducers } from 'redux';

import personalFilesReducer from './PersonalFilesReducer';
import viewSwitcherReducer from './ViewSwitcherReducer';


const allReducers = combineReducers({
  personalFilesReducer,
  viewSwitcherReducer
})

export default allReducers;

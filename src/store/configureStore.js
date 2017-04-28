import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import allReducers from '../reducers';
import socketMiddleware from '../middlewares/SocketMiddleware';

const configureStore = () => {
  return createStore(
    allReducers,
    applyMiddleware(thunk, socketMiddleware)
  );
}

export default configureStore;

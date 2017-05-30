import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import allReducers from '../reducers'

const configureStore = () => {
  return createStore(
    allReducers,
    applyMiddleware(thunk)
  )
}

export default configureStore

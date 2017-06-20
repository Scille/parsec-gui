import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
import AppRouter from './components/AppRouter'
import './index.css'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById('root'),
  document.addEventListener('dragover', event => event.preventDefault()),
  document.addEventListener('drop', event => event.preventDefault())
)

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import 'core-js/fn/array/flat-map'

import store from './store.js';
import App from './App';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

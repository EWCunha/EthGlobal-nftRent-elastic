import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux'
import rootReducer from './reducers/rootReducer';

const store = createStore(rootReducer)

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

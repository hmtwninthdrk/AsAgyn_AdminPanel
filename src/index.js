import React from 'react'
import { createRoot } from 'react-dom/client'

import 'core-js'

import App from './App'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <App />
</React.StrictMode>,
  // <Provider store={store}>
  //   <App />
  // </Provider>,
)

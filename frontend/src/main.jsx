import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { store } from './app/store.js'
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify'
import { setTokenFromStorage } from './features/loginSlice.js'

const token = localStorage.getItem('token');
if(token){
  store.dispatch(setTokenFromStorage(token));
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    <ToastContainer/>
    </Provider>
  </StrictMode>,
)

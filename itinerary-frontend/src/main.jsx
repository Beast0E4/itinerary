import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import store from './app/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#233634',
              color: '#F3ECDA',
              border: '1px solid #2C423E',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#4FA491', secondary: '#12201E' } },
            error: { iconTheme: { primary: '#C4614C', secondary: '#12201E' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
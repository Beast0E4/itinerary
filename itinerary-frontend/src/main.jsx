import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import store from './app/store';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#182420',
                color: '#EDF3F0',
                border: '1px solid #223330',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#4FBF9F', secondary: '#0C1412' } },
              error: { iconTheme: { primary: '#E2685A', secondary: '#0C1412' } },
            }}
          />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
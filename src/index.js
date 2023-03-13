import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SolanaProvider from "./components/web3provider/web3provider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </React.StrictMode>
);

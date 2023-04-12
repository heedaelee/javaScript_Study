import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import App_useImperativeHandle from './App_useImperativeHandle';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <App_useImperativeHandle />
  </React.StrictMode>,
);

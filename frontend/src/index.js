import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import enUS from 'antd/locale/en_US';
import reportWebVitals from './reportWebVitals';
 import { ConfigProvider } from 'antd';
import axios from 'axios';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import { baseURL } from './local/l1';

// IMPORTANT: Initialize dayjs plugins
dayjs.extend(customParseFormat);

// Set default locale
dayjs.locale('en');

const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.baseURL=baseURL
 






// 🔐 Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 👈 yahin se utha raha hai

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);





root.render(
  <React.StrictMode>
{/* <GoogleOAuthProvider clientId="319113493319-f4638vr2ent4e4tm1evgkso1s31u1uc8.apps.googleusercontent.com"> */}
    <ConfigProvider locale={enUS}>
         <App />
      
      </ConfigProvider>      
{/* </GoogleOAuthProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

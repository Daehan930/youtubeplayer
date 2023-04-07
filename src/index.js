import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Main';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 사용시 콘솔창에 여러번 렌더링되는 것을 확인할 수 있음
  // api 요청이 여러번 발생하는 것을 확인할 수 있음
  
  // <React.StrictMode> 
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

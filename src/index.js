import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createInstance} from "@adobe/alloy";
import {WebSdkContext} from "./WebSdkContext";

const alloy = createInstance({ name: "alloy" });
alloy("configure", {
    "edgeConfigId": "e8922806-0c73-4c26-a4f8-f102f34c9af6",
    "orgId":"692D3C645C5CDA980A495CB3@AdobeOrg"
});
// alloy needs to be global to make the debugger work correctly.
window.alloy = alloy;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <WebSdkContext.Provider value={alloy}>
              <App />
          </WebSdkContext.Provider>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

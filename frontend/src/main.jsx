import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { persistor, store } from "./Redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

import ReactGA from "react-ga4";

ReactGA.initialize("G-3ZL3KFMBM2");

ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <ToastContainer />
    </PersistGate>
  </Provider>
);

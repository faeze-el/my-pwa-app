import React from "react";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client'
import "./index.css";
import App from "./App";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((error) => console.error("Service Worker Registration Failed:", error));
}

// Use React 18's createRoot method
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

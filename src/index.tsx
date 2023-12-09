import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./Global.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <div
      style={{
        backgroundColor: "#23273E",
        width: "100%",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <App />
    </div>
  </React.StrictMode>
);

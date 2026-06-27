import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: "#182a35",
          color: "#fff",
          border: "1px solid rgba(254, 127, 45, 0.3)",
        },
      }}
    />
  </AuthProvider>
);
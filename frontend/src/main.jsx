import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PromptProvider } from "./context/PromptContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <PromptProvider>
          <App />
        </PromptProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);

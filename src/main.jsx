import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import { SettingsProvider } from "./context/SettingsContext";
import { TransactionProvider } from "./context/TransactionContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <TransactionProvider>
          <PortfolioProvider>
            <App />
          </PortfolioProvider>
        </TransactionProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
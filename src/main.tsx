import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { initializeAuthSession } from "./shared/state/authSession";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const rootContainer = rootElement;

function bootstrapApp() {
  createRoot(rootContainer).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );

  // Initialize session asynchronously without blocking the initial render.
  // The app handles loading and unauthenticated states internally.
  void initializeAuthSession();
}

bootstrapApp();

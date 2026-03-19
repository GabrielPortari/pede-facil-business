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

async function bootstrapApp() {
  // Initialize auth session before rendering to avoid premature redirects
  // on protected routes while a refresh is in progress.
  await initializeAuthSession();

  createRoot(rootContainer).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}

bootstrapApp();

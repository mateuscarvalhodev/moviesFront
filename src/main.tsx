import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeToggle } from "./components/ThemeToggle/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="relative">
      <App />
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Layout } from "./components/Layout/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout>
      <div className="relative">
        <App />
        <div className="fixed bottom-4 right-4 z-50"></div>
      </div>
    </Layout>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { Layout } from "./components/Layout/index.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Login } from "./pages/auth/login/index.tsx";
import { Register } from "./pages/auth/Register/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>
);

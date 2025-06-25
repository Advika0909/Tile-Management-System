import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./App";
import Dashboard from "./dashboard"; // Create this component
import {Application_Master} from "./ApplicationDB";
import { Category_Master } from "./Category";
import { Products_Master } from "./Products";


import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/application" element={<Application_Master />} />
        <Route path="/category" element={<Category_Master />} />
        <Route path="/product" element={<Products_Master />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

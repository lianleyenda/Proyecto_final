import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import Login from "./Login.jsx";
import Registro from "./registro.jsx";
import Olvido from "./olvido.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/olvide" element={<Olvido />} />
      </Routes>
    </Router>
  </StrictMode>
);

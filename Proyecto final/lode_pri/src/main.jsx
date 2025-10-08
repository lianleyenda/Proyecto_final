import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Inicio from "../componetes/principal.jsx";
import Login from "../componetes/Login.jsx";
import Registro from "../componetes/registro.jsx";
import Olvido from "../componetes/olvido.jsx";
import Promociones from "../componetes/Promociones.jsx";
import Sesion from "../componetes/sesion.jsx";
import Contacto from "../componetes/Contacto.jsx";
import AdminPanel from "../componetes/AdminPanel.jsx";


import { CarritoProvider } from "../componetes/carritocontext.jsx"; // 🔹 Importamos el provider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CarritoProvider> {/* 🔹 Envolvemos TODO con el Provider */}
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/olvide" element={<Olvido />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/inicio" element={<Sesion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/Admin" element={<AdminPanel />} />

        </Routes>
      </Router>
    </CarritoProvider>
  </StrictMode>
);

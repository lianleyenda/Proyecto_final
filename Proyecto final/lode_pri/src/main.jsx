import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Inicio from "../componetes/principal.jsx";
import Login from "../componetes/Login.jsx";
import Registro from "../componetes/registro.jsx";
import Olvido from "../componetes/olvido.jsx";
import Promociones from "../componetes/Promociones.jsx";
<<<<<<< HEAD
import Sesion from "../componetes/sesion.jsx";

=======
import Contacto from "../componetes/Contacto.jsx";
>>>>>>> 1cb73a0890e9b23551e0b0c8e6fa0c6cf4ef021c

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/olvide" element={<Olvido />} />
        <Route path="/promociones" element={<Promociones />} />
<<<<<<< HEAD
        <Route path="/inicio" element={<Sesion />}/>
        
        
=======
        <Route path="/contacto" element={<Contacto />} />
>>>>>>> 1cb73a0890e9b23551e0b0c8e6fa0c6cf4ef021c
      </Routes>
    </Router>
  </StrictMode>
);

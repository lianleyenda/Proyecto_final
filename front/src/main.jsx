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
import Error404 from "../componetes/error404.jsx";

import { CarritoProvider } from "../componetes/carritocontext.jsx"; // 🔹 Importamos el provider
import PagoExitoso from "../componetes/pago_exitosos.jsx";
import ContactoSesion from "../componetes/contacto-sesion.jsx";
import PromocionesSesion from "../componetes/Promociones-sesion.jsx";
import Pago from "../componetes/pago.jsx";
import Admin from "../componetes/admin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CarritoProvider>
      {" "}
      {/* 🔹 Envolvemos TODO con el Provider */}
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/olvide" element={<Olvido />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/inicio" element={<Sesion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/pago/exitoso" element={<PagoExitoso />} />
          <Route path="contacto/sesion" element={<ContactoSesion />} />
          <Route path="promociones/sesion" element={<PromocionesSesion />} />
          <Route path="/pago"  element={<Pago/>}/>
          <Route path="/inicio/admin" element={<Admin/>}/>
          {/* 👇 Cualquier ruta no encontrada muestra el error 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </CarritoProvider>
  </StrictMode>
);

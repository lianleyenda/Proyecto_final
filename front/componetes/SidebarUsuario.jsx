import { useState } from "react";
import "../src/Carrito.css";

function SidebarUsuario({ usuario, onLogout, enContacto }) {
  const [isOpen, setIsOpen] = useState(false);
  const email = JSON.parse(localStorage.getItem("Email"));

  return (
    <div className="tipografia">
      {/* Mostrar el correo del usuario como título */}
      <h2
        className="usuario-nombre"
        onClick={() => setIsOpen(true)}
        style={{ color: enContacto ? "black" : "" }}
      >
        {usuario || email || "Usuario"}
      </h2>

      {/* Fondo oscuro */}
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ✖
        </button>

        <h2>👤 Mi cuenta</h2>
        <div className="pestaña">
          <p>
            <strong>Email:</strong> {email || "No disponible"}
          </p>
          <button onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}

export default SidebarUsuario;

import { useState } from "react";
import "./PerfilMenu.css"; // el CSS lo ponemos aparte

function PerfilMenu() {
  const [abierto, setAbierto] = useState(false);

  const toggleMenu = () => {
    setAbierto(!abierto);
  };

  const cerrarSesion = () => {
    console.log("Sesión cerrada");
    // acá podrías hacer fetch a tu backend o limpiar localStorage
  };

  return (
    <div className="perfil-container">
      <h2 className="perfil-titulo" onClick={toggleMenu}>
        Mi cuenta
      </h2>

      {abierto && (
        <div className="perfil-menu">
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

export default PerfilMenu;

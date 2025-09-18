import { Link } from "react-router-dom";
import "../src/login.css";

export default function Olvido() {
  return (
    <div className="fondo">
      <div className="contenedor">
        <div className="card">
          <h1 className="titulo">Recuperar Contraseña</h1>

          <label className="label" htmlFor="email">
            Introduce tu dirección de correo electrónico
          </label>
          <input
            className="input"
            type="email"
            id="email"
            placeholder="ejemplo@correo.com"
          />

          <button className="submit">
            <span style={{ marginRight: "8px" }}>✈️</span> Enviar
          </button>

          <div className="links">
            <Link to="/Login">Volver</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

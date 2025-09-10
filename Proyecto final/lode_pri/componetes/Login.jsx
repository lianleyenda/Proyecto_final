import { Link } from "react-router-dom";
import "../src/login.css";

export default function Login() {
  return (
    <body className="fondo">
    <div className="contenedor">
      <div className="card">
        <h1 className="titulo">Bienvenido</h1>
        <input className="input" type="text" placeholder="Usuario" />
        <input className="input" type="password" placeholder="Contraseña" />
        <button className="submit">Ingresar</button>

        <div className="links">
          <Link to="/olvide">¿Olvidaste tu contraseña?</Link>
          <Link to="/registro">¿No tienes cuenta? Regístrate</Link>
        </div>
      </div>
      <div className="volver">
        <Link to="/inicio">← Volver</Link>
      </div>
    </div>
    </body>
  );
}

import { Link } from "react-router-dom";
import "../src/error404.css";

export default function Error404() {
  return (
    <div className="error-fondo">
      <div className="error-contenedor">
        <img src="img/burger-sad.png" alt="Burger triste" className="error-img" />
        <h1 className="error-titulo">🍔 ¡Ups! Página no encontrada</h1>
        <p className="error-texto">
          Parece que te fuiste por la ruta equivocada...  
          pero tranquilo, nuestras hamburguesas te esperan 🍟
        </p>
        <Link to="/" className="error-boton">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

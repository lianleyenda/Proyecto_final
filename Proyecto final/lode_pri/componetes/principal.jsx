import { useEffect, useState } from "react";
import "../src/App.css";
import { Link } from "react-router-dom";

function Inicio() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="promo">
        <span>
          ¡Hoy tu hambre tiene premio! 🍔 Comprá 2 hamburguesas y la tercera va
          de regalo —solo por tiempo limitado.
        </span>
        <button>Ir</button>
      </div>

      <header>
        <nav className="navbar">
          <div className="navbar-left">
            <a href="/">
              <img src="img/lode_pri.png" alt="Logo LODEPRI" />
            </a>
            <a href="/">
              <span>LODEPRI</span>
            </a>
          </div>

          <div className="navbar-right">
            <a href="#">Página principal</a>
            <a href="#">Contacto</a>
            <a href="#">Promociones</a>
            <a href="/Login">Iniciar Sesión</a>
          </div>
        </nav>
      </header>

      <div className="hero-imagen">
        <img src="img/imagen_incio.png" alt="Inicio" />
      </div>

      <div className="mensage">
        <h2>
          Cada hamburguesa es única, preparada con cariño y sabor que enamora.
        </h2>
      </div>

      <div>
        <h2>Hamburguesas</h2>
        <ul>
          {menu.map((item) => (
            <li key={item.id_Stock}>
              <img src="img/lode_pri.png"></img>
              <h3>{item.Producto}</h3>
              <p>Precio: ${item.Costo}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Inicio;

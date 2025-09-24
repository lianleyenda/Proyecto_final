import { useEffect, useState } from "react";
import "../src/Promociones.css";
import { Link } from "react-router-dom";

export default function Promociones() {
  const [promos, setPromos] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/Promociones")
      .then((res) => res.json())
      .then((data) => setPromos(data))
      .catch((err) => console.error(err));
  }, []);

 useEffect(() => {
   const handleScroll = () => {// hacemos la funcion que este fija
     if (window.scrollY > 50) {// window es la venta que vemos en cada vista le decimos que cunado se scrolee 50 px de true
       setScrolled(true);
     } else {
       setScrolled(false);
     }
   };
   window.addEventListener("scroll", handleScroll);// le decimos caundo pasas la funciom
   return () => window.removeEventListener("scroll", handleScroll);//es para qu ele componente no quede siempre activo
 }, []);


  return (
    <>
      <header  className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <nav className="navbar">
          <div className="navbar-left">
            <Link to="/">
              <img src="img/lode_pri.png" alt="Logo LODEPRI" />
            </Link> 
            <Link to="/">
              <span>LODEPRI</span>
            </Link>
          </div>

          <div className="navbar-right">
            <Link to="/">Página principal</Link>
            <Link to="#">Contacto</Link>
            <Link to="/Promociones">Promociones</Link>
            <Link to="/Login">Iniciar Sesión</Link>
          </div>
        </nav>
      </header>
     <div className="hero-imagen">
        <img src="img/imagen_incio.png" alt="Inicio" />
      </div>

      <div className="promo">
        <span>¡Estas son nuestras promociones actuales! 🎉</span>
      </div>

      <div className="producto">
        <ul>
          {promos.map((item) => (
            <ol key={item.id}>
              <img src={`img/${item.imagen}`} alt={item.nombre} />
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <p>Precio: ${item.precio}</p>
              <button>Añadir al carrito</button>
            </ol>
          ))}
        </ul>
      </div>
    </>
  );
}

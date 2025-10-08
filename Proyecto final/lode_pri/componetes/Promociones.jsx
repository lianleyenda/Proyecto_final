import { useEffect, useState } from "react";
import "../src/Promociones.css";
import { Link } from "react-router-dom";

export default function Promociones() {
  const [promos, setPromos] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [heroHeight, setHeroHeight] = useState(615); // Altura inicial de la imagen

  useEffect(() => {
    // Cargar promociones
    fetch("http://127.0.0.1:5000/Promociones")
      .then((res) => res.json())
      .then((data) => {
        console.table(data)
        setPromos(data)})
      .catch((err) => console.error(err));

    // Cargar productos más vendidos
    fetch("http://127.0.0.1:5000/productos-mas-vendidos")
      .then((res) => res.json())
      .then((data) => setProductosMasVendidos(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const scrolledAmount = window.scrollY;
      const newHeight = Math.max(400, 615 - scrolledAmount);
      setHeroHeight(newHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="promociones-promo">
        <span>¡Estas son nuestras promociones actuales! 🎉</span>
      </div>

      <header className={`promociones-navbar ${scrolled ? "scrolled" : ""}`}>
        <nav className="promociones-navbar">
          <div className="promociones-navbar-left">
            <Link to="/">
              <img src="img/lode_pri.png" alt="Logo LODEPRI" />
            </Link>
            <Link to="/">
              <span>LODEPRI</span>
            </Link>
          </div>

          <div className="promociones-navbar-right">
            <Link to="/">Página principal</Link>
            <Link to="/Contacto">Contacto</Link>
            <Link to="/Promociones">Promociones</Link>
            <Link to="/Login">Iniciar Sesión</Link>
          </div>
        </nav>
      </header>

      <div
        className="promociones-hero-imagen"
        style={{ height: `${heroHeight}px` }}
      >
        <img src="img/imagen_incio.png" alt="Inicio" />
      </div>

      <div className="promociones-mensage">
        <h2>¡Explora nuestras promociones exclusivas!</h2>
      </div>

      <div className="promociones-producto">
        <ul>
          {promos.map((item) => (
            <ol key={item.id}>
              <img src={`img/${item.imagen_nombre}`} alt={item.nombre} />
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <p>Precio: ${item.precio}</p>
              <button>Añadir al carrito</button>
            </ol>
          ))}
        </ul>
      </div>

      {/* Aquí se encuentra la nueva sección para los productos más vendidos */}
      <div className="promociones-producto">
        <h2>Productos Más Vendidos</h2>
        <ul>
          {productosMasVendidos.map((item) => (
            <ol key={item.Producto}>
              <img
                src={`img/${item.imagen}`} 
                alt={item.Producto}
                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
              />
              <h3>{item.Producto}</h3>
              <p>Total Vendido: {item.total_vendido}</p>
              <p>Precio: ${item.Costo}</p>
              <button>Añadir al carrito</button>
            </ol>
          ))}
        </ul>
      </div>

      <footer className="footer-promociones">
        <p>© 2025 VAPALEPEN | Todos los derechos reservados</p>
        <p>
          Dirección: 4578 Alberto Demiddi, Barrio Olímpico | Teléfono de
          Contacto: +54 9 11 61138645
        </p>

        <p>
          Síguenos en nuestras redes sociales para enterarte de nuestras ofertas
          y novedades.
        </p>
      </footer>
    </>
  );
}

import { useEffect, useState } from "react";
import "../src/Promociones.css";
import { Link, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import SidebarCarrito from "./Carrito";
import SidebarUsuario from "./SidebarUsuario";
import { useCarrito } from "./carritocontext"; // ✅ Para poder usar agregarCarrito()

export default function PromocionesSesion() {
  const [promos, setPromos] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [heroHeight, setHeroHeight] = useState(615);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 👈 paginado
  const navigate = useNavigate();
  const { agregarCarritoProducto, agregarCarritoPromo } = useCarrito(); // ✅ Usamos ambas funciones

  // 🔹 Carga de datos
  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:5000/Promociones").then((res) => res.json()),
      fetch("http://127.0.0.1:5000/productos-mas-vendidos").then((res) =>
        res.json()
      ),
    ])
      .then(([promosData, vendidosData]) => {
        setPromos(promosData);
        setProductosMasVendidos(vendidosData);
        setTimeout(() => setLoading(false), 2000);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Scroll y altura del hero
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setHeroHeight(Math.max(400, 615 - window.scrollY));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Usuario desde localStorage
  useEffect(() => {
    const usuarioData = localStorage.getItem("Usuario");
    if (usuarioData) setUsuario(JSON.parse(usuarioData));
  }, []);

  // 🔥 Animación de carga
  if (loading) {
    return (
      <div className="loader-container">
        <DotLottieReact
          src="../src/assets/burger-loading.lottie"
          loop
          autoplay
        />
        <p className="loader-text">
          🍔💥 ¡Preparando ofertas irresistibles para VOS!
        </p>
      </div>
    );
  }

  // 🔹 Paginado simple
  const totalPages = 2;
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="promociones-promo">
        <span>¡Estas son nuestras promociones actuales! 🎉</span>
      </div>

      <header className={`promociones-navbar ${scrolled ? "scrolled" : ""}`}>
        <nav className="promociones-navbar">
          <div className="promociones-navbar-left">
            <Link to="/inicio">
              <img src="/img/lode_pri.png" alt="Logo LODEPRI" />
            </Link>
            <Link to="/inicio">
              <span>LODEPRI</span>
            </Link>
          </div>

          <div className="promociones-navbar-right">
            <Link to="/inicio">Página principal</Link>
            <Link to="/Contacto/sesion">Contacto</Link>
            <Link to="/Promociones/sesion">Promociones</Link>
            {usuario && (
              <SidebarUsuario
                usuario={usuario}
                onLogout={() => {
                  localStorage.removeItem("Usuario");
                  setUsuario(null);
                  navigate("/");
                }}
              />
            )}
            <SidebarCarrito />
          </div>
        </nav>
      </header>

      {/* 🔹 Imagen de inicio intacta */}
      <div
        className="promociones-hero-imagen"
        style={{ height: `${heroHeight}px` }}
      >
        <img src="/img/imagen_incio.png" alt="Inicio" />
      </div>

      <div className="promociones-mensage">
        {currentPage === 1 ? (
          <h2>¡Explora nuestras promociones exclusivas!</h2>
        ) : (
          <h2>🔥 Nuestros productos más vendidos 🔥</h2>
        )}
      </div>

      {/* 📦 Página 1 → Promociones */}
      {currentPage === 1 && (
        <div className="promociones-producto">
          <ul>
            {promos.map((item) => (
              <ol key={item.id}>
                <img src={`/img/${item.imagen_nombre}`} alt={item.nombre} />
                <h3>{item.nombre}</h3>
                <p>{item.descripcion}</p>
                <p>Precio: ${item.precio}</p>
                <button
                  onClick={() => {
                    agregarCarritoPromo(item.id); // ✅ Usamos la función para promociones
                    setMostrarAnimacion(true);
                    setTimeout(() => setMostrarAnimacion(false), 1000);
                  }}
                >
                  Añadir al carrito
                </button>
              </ol>
            ))}
          </ul>
        </div>
      )}

      {/* 📈 Página 2 → Más vendidos */}
      {currentPage === 2 && (
        <div className="promociones-producto">
          <ul>
            {productosMasVendidos.map((item) => (
              <ol key={item.Producto}>
                <img
                  src={`/img/${item.imagen}`}
                  alt={item.Producto}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                  }}
                />
                <h3>{item.Producto}</h3>
                <p>Total Vendido: {item.total_vendido}</p>
                <p>Precio: ${item.Costo}</p>
                
                
                              </ol>
            ))}
          </ul>
        </div>
      )}

      {/* 📄 Paginado */}
      <div className="paginado-simple">
        {currentPage === 2 && (
          <button onClick={prevPage} className="volver-btn">
            ← Volver
          </button>
        )}
        <span className="numero-pagina">{currentPage}</span>
        {currentPage === 1 && (
          <button onClick={nextPage} className="mas-vendidos-btn">
            🔥 Ver los productos más vendidos
          </button>
        )}
      </div>

      <footer className="footer-promociones">
        <p>© 2025 VAPALEPEN | Todos los derechos reservados</p>
        <p>
          Dirección: 4578 Alberto Demiddi, Barrio Olímpico | Teléfono: +54 9 11
          61138645
        </p>
        <p>Seguinos en redes para más novedades.</p>
      </footer>
    </>
  );
}

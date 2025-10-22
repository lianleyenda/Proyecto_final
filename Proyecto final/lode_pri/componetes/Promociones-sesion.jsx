import { useEffect, useState } from "react";
import "../src/Promociones.css";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import SidebarCarrito from "./Carrito";
import SidebarUsuario from "./SidebarUsuario"; // 🔹 Importa tu sidebar
import { useNavigate } from "react-router-dom";

export default function PromocionesSesion() {
  const [promos, setPromos] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [heroHeight, setHeroHeight] = useState(615);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null); // 🔹 Estado del usuario
  const navigate = useNavigate();

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

        // ⏳ Esperar 2 segundos antes de quitar la animación
        setTimeout(() => setLoading(false), 2000);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const scrolledAmount = window.scrollY;
      setHeroHeight(Math.max(400, 615 - scrolledAmount));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Recuperar usuario del localStorage al cargar
  useEffect(() => {
    const usuarioData = localStorage.getItem("Usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
  }, []);

  // 🔥 Mostrar animación de carga


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
                  navigate("/"); // ✅ te redirige correctamente al inicio
                }}
              />
            )}

            <SidebarCarrito />
          </div>
        </nav>
      </header>

      <div
        className="promociones-hero-imagen"
        style={{ height: `${heroHeight}px` }}
      >
        <img src="/img/imagen_incio.png" alt="Inicio" />
      </div>

      <div className="promociones-mensage">
        <h2>¡Explora nuestras promociones exclusivas!</h2>
      </div>

      <div className="promociones-producto">
        <ul>
          {promos.map((item) => (
            <ol key={item.id}>
              <img src={`/img/${item.imagen_nombre}`} alt={item.nombre} />
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <p>Precio: ${item.precio}</p>
              <button>Añadir al carrito</button>
            </ol>
          ))}
        </ul>
      </div>

      <div className="promociones-producto">
        <h2>Productos Más Vendidos</h2>
        <ul>
          {productosMasVendidos.map((item) => (
            <ol key={item.Producto}>
              <img
                src={`img/${item.imagen}`}
                alt={item.Producto}
                style={{ width: "100%", height: "auto", borderRadius: "10px" }}
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
          Dirección: 4578 Alberto Demiddi, Barrio Olímpico | Teléfono: +54 9 11
          61138645
        </p>
        <p>Seguinos en redes para más novedades.</p>
      </footer>
    </>
  );
}

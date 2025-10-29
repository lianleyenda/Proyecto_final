import { useEffect, useState } from "react";
import "../src/App.css";
import { useNavigate } from "react-router-dom";
import SidebarCarrito from "./Carrito";
import { useCarrito } from "./carritocontext";
import SidebarUsuario from "./SidebarUsuario";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // 🔹 Animaciones Lottie

function Sesion() {
  const [usuario, setUsuario] = useState(null);
  const { agregarCarrito } = useCarrito();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // 🔹 Estado de carga
  const [scrolled, setScrolled] = useState(false);
  const [heroHeight, setHeroHeight] = useState(615);
  const [menu, setMenu] = useState([]);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false); // 🔹 Animación al agregar carrito

  // 🔹 Recuperar usuario
  useEffect(() => {
    const usuarioData = localStorage.getItem("Usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
  }, []);

  // 🔹 Simula carga de datos con animación
  useEffect(() => {
    fetch("http://127.0.0.1:5000/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error(err));

    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Scroll para header y héroe
  useEffect(() => {
    const handleScroll = () => {
      const scrolledAmount = window.scrollY;
      setScrolled(scrolledAmount > 50);
      setHeroHeight(Math.max(400, 615 - scrolledAmount));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        <p className="loader-text">🍔✨ Preparando el menú más sabroso para vos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="promo">
        <span>
          ¡Hoy tu hambre tiene premio! 🍔 Comprá 2 hamburguesas y la tercera va
          de regalo —solo por tiempo limitado.
        </span>
        <a href="/Promociones">
          <button>Ir</button>
        </a>
      </div>

      <header className={scrolled ? "scrolled" : ""}>
        <nav className="navbar-navegacion">
          <div className="navbar-left">
            <a href="/inicio">
              <img src="img/lode_pri.png" alt="Logo LODEPRI" />
            </a>
            <a href="/inicio">
              <span>LODEPRI</span>
            </a>
          </div>

          <div className="navbar-right">
            <a href="/inicio">Página principal</a>
            <a href="/contacto/sesion">Contacto</a>
            <a href="/Promociones/sesion">Promociones</a>

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

            <SidebarCarrito abrirAutomaticamente={true}/>
          </div>
        </nav>
      </header>

      {/* 🔹 Imagen de inicio (NO TOCAR) */}
      <div className="hero-imagen" style={{ height: `${heroHeight}px` }}>
        <img src="img/imagen_incio.png" alt="Inicio" />
      </div>

      <div className="mensage">
        <h2>
          Cada hamburguesa es única, preparada con cariño y sabor que enamora.
        </h2>
      </div>

      <div className="producto">
        <ul>
          {menu.map((item) => (
            <ol key={item.id_Stock} style={{ position: "relative" }}>
              <img src={`img/${item.Imagen}`} alt={item.Producto} />
              <h3>{item.Producto}</h3>
              <p>Precio: ${item.Costo}</p>
              <button
                onClick={() => {
                  agregarCarrito(item.id_Stock);
                  setMostrarAnimacion(true);
                  setTimeout(() => setMostrarAnimacion(false), 1000);
                }}
              >
                Añadir al carrito
              </button>

              {/* 🔹 Animación de carrito */}
              {mostrarAnimacion && (
                <DotLottieReact
                  src="../src/assets/carrito-lottie.lottie"
                  loop={false}
                  autoplay
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                />
              )}
            </ol>
          ))}
        </ul>
      </div>

      <div className="presentacion">
        <img src="img/mano_de_hamburguesa.png" alt="Mano con hamburguesa" />

        <div className="presentacion-texto">
          <h2>¿Quiénes somos?</h2>
          <p>
            Somos dos hermanos de 17 años que decidimos arrancar este proyecto
            juntos. Con muchas ganas y trabajo, creamos un local de hamburguesas
            caseras, rápidas y sin vueltas, pensado para que vengas, pidas y
            disfrutes bien.
          </p>
        </div>
      </div>

      <div className="presentacion">
        <img src="img/muestra_de_hamburguesas.png" alt="Mano con hamburguesa" />

        <div className="presentacion-texto">
          <h2>¿Qué hacemos?</h2>
          <p>
            En nuestro local nos dedicamos a preparar hamburguesas caseras con
            ingredientes frescos y de calidad, pensadas para que cada bocado
            tenga sabor auténtico. Cocinamos al momento, de forma rápida y sin
            vueltas, para que disfrutes una comida rica en minutos. Nuestra
            propuesta es simple: hamburguesas únicas, hechas con dedicación,
            servidas con agilidad y en un ambiente limpio y cómodo.
          </p>
        </div>
      </div>

      <footer className="derechos">
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

export default Sesion;

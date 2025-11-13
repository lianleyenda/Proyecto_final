import { useEffect, useState } from "react";
import "../src/App.css";
import { TiShoppingCart } from "react-icons/ti";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function Inicio() {
  const [scrolled, setScrolled] = useState(false);
  const [heroHeight, setHeroHeight] = useState(615);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🌀 Animación de carga
  useEffect(() => {
    // Simula carga de datos (2 segundos)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 📜 Scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolledAmount = window.scrollY;
      setScrolled(scrolledAmount > 50);
      setHeroHeight(Math.max(400, 615 - scrolledAmount));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 📦 Fetch menú
  useEffect(() => {
    fetch("http://127.0.0.1:5000/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔥 Mostrar animación de carga
  if (loading) {
    return (
      <div className="loader-container">
        <DotLottieReact
          src="../src/assets/burger-loading.lottie"
          loop
          autoplay
        />
        <p className="loader-text">
          🍔💥 Preparando el menú más sabroso para vos...
        </p>
      </div>
    );
  }

  // 🚀 Página principal
  return (
    <>
      <div className="promo">
        <span>
          ¡Aca estan nuestros productos!🍔
        </span>
        
      </div> 

      <header className={scrolled ? "scrolled" : ""}>
        <nav className="navbar-navegacion">
          <div className="navbar-left">
            <a href="/">
              <img src="img/lode_pri.png" alt="Logo LODEPRI" />
            </a>
            <a href="/">
              <span>LODEPRI</span>
            </a>
          </div>
          {/* 🔹 BOTÓN HAMBURGUESA (solo visible en móvil) */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            &#9776;
          </button>

          {/* 🔹 MENÚ (se abre/cierra en versión móvil) */}
          <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
            <a href="/" onClick={() => setMenuOpen(false)}>
              Página principal
            </a>
            <a href="/Contacto" onClick={() => setMenuOpen(false)}>
              Contacto
            </a>
            {/* <a href="/Promociones" onClick={() => setMenuOpen(false)}>
              Promociones
            </a> */}
            <a href="/Login" onClick={() => setMenuOpen(false)}>
              Iniciar Sesión
            </a>
            <a href="/Login" onClick={() => setMenuOpen(false)}>
              <TiShoppingCart size={40} />
            </a>{" "}
          </div>
        </nav>
      </header>

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
            <ol key={item.id_Stock}>
              <img src={`img/${item.Imagen}`} alt={item.Producto} />
              <h3>{item.Producto}</h3>
              <p>Precio: ${item.Costo}</p>
              <a href="/Login">
                <button>Añadir al carrito</button>
              </a>
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
        <img src="img/muestra_de_hamburguesas.png" alt="Hamburguesas" />

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

export default Inicio;

import { useEffect, useState } from "react";
import "../src/App.css";
import { Link } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";
import SidebarCarrito from "./Carrito";
import { useCarrito } from "./carritocontext";

function Sesion() {
  const [usuario, setUsuario] = useState(null);
  const { agregarCarrito } = useCarrito();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Recuperamos los datos del usuario desde el localStorage
    const usuarioData = localStorage.getItem("Usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData)); // Convertimos el JSON a objeto
      
    } else {
      console.log("No hay usuario en localStorage");
    }
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // hacemos la funcion que este fija
      if (window.scrollY > 50) {
        // window es la venta que vemos en cada vista le decimos que cunado se scrolee 50 px de true
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll); // le decimos caundo pasas la funciom
    return () => window.removeEventListener("scroll", handleScroll); //es para qu ele componente no quede siempre activo
  }, []);

  const [heroHeight, setHeroHeight] = useState(615); // altura inicial

  useEffect(() => {
    const elScroll = () => {
      const scrolledAmount = window.scrollY;

      if (scrolledAmount > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Reduce la altura de la imagen del héroe al hacer scroll
      const newHeight = Math.max(400, 615 - scrolledAmount); // no deja que quede menor a 400px
      setHeroHeight(newHeight);
    };

    window.addEventListener("scroll", elScroll);
    return () => window.removeEventListener("scroll", elScroll);
  }, []);



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
        <a href="/Promociones">
          <button>Ir</button>
        </a>
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

          <div className="navbar-right">
            <a href="/">Página principal</a>
            <a href="#">Contacto</a>
            <a href="/Promociones">Promociones</a>
            <h2>{usuario}</h2>
            <SidebarCarrito />
            
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
              <button onClick={() => agregarCarrito(item.id_Stock)}>
                Añadir al carrito
              </button>
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
        <h2></h2>
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

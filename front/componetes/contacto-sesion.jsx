import "../src/contacto.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarUsuario from "./SidebarUsuario";
import { useCarrito } from "./carritocontext";
import SidebarCarrito from "./Carrito";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function ContactoSesion() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const { carrito } = useCarrito();
  const navigate = useNavigate();

  // 🔹 Opiniones y buscador
  const [opiniones, setOpiniones] = useState([]);
  const [mostrarOpiniones, setMostrarOpiniones] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // 🔹 Scroll del navbar
  const [scrolled, setScrolled] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioData = localStorage.getItem("Usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Efecto scroll (navbar blanco al bajar)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nombre || !email || !mensaje) {
      setError("Todos los campos son requeridos.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.mensaje);
        setNombre("");
        setEmail("");
        setMensaje("");
        setError(null);
      } else {
        setError(data.mensaje || "Hubo un problema al enviar tu mensaje.");
      }
    } catch (error) {
      setError("Error al conectar con el servidor.");
    }
  };

  // 🔹 Obtener todas las opiniones
  const obtenerOpiniones = async () => {
    try {
      const res = await fetch("http://localhost:5000/opiniones");
      const data = await res.json();
      setOpiniones(data);
      setMostrarOpiniones(!mostrarOpiniones);
    } catch (error) {
      console.error("Error al obtener opiniones:", error);
    }
  };

  // 🔹 Buscar opiniones por palabra (en tiempo real)
  useEffect(() => {
    if (busqueda.trim() === "") return;
    const buscarOpiniones = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/opiniones/buscar/${busqueda}`
        );
        const data = await res.json();
        setOpiniones(data);
      } catch (error) {
        console.error("Error al buscar opiniones:", error);
      }
    };
    const delay = setTimeout(buscarOpiniones, 400);
    return () => clearTimeout(delay);
  }, [busqueda]);

  if (loading) {
    return (
      <div className="loader-container">
        <DotLottieReact
          src="../src/assets/burger-loading.lottie"
          loop
          autoplay
        />
        <p className="loader-text">
          🍟💬 Preparando el formulario para tu mensaje sabroso...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 🔹 Navbar con scroll */}
      <header className={`contacto-navbar ${scrolled ? "scrolled" : ""}`}>
        <nav className="contacto-navbar">
          <div className="contacto-navbar-left">
            <Link to="/inicio">
              <img src="/img/lode_pri.png" alt="Logo LODEPRI" />
            </Link>
            <Link to="/inicio">
              <span>LODEPRI</span>
            </Link>
          </div>
          <div
            className="contacto-navbar-right"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Link to="/inicio">Página principal</Link>
            <Link to="/Contacto/sesion">Contacto</Link>
            {/* <Link to="/Promociones/sesion">Promociones</Link> */}

            {usuario && (
              <SidebarUsuario
                usuario={usuario}
                enContacto={true}
                onLogout={() => {
                  localStorage.removeItem("Usuario");
                  navigate("/");
                }}
              />
            )}
            <SidebarCarrito />
          </div>
        </nav>
      </header>

      {/* Promo */}
      <div className="contacto-promo">
        <span>¿Tienes dudas o quieres contactarnos? ¡Escríbenos!</span>
      </div>

      {/* Mensaje central */}
      <div className="contacto-mensage">
        <h2>¿Dónde nos encontramos?</h2>
      </div>

      {/* Mapa */}
      <div className="contacto-mapa">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.005135349687!2d-58.453684225046224!3d-34.67981986151993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccc0884322765%3A0xc2713b6b5831d8c1!2sEscuela%20Secundaria%20T%C3%A9cnica%20UBA%20en%20Villa%20Lugano!5e0!3m2!1ses-419!2sar!4v1761311983959!5m2!1ses-419!2sar"
          width="600"
          height="450"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* Texto descriptivo */}
      <div className="contacto-descripcion">
        <p>📍 Nos encontramos en Roca y Escalada.</p>
        <p>
          🍔 Nuestra hamburguesa es única, con un sabor que no vas a encontrar
          en ningún otro lugar.
        </p>
        <p>👑 ¡Vení a probarla y descubrí por qué todos vuelven por más!</p>
        <h3>Envíanos tu consulta</h3>

        {/* 🔹 Botón para mostrar opiniones */}
        <button onClick={obtenerOpiniones} className="boton-opiniones">
          {mostrarOpiniones ? "Ocultar Opiniones" : "Ver Opiniones de Clientes"}
        </button>
      </div>

      {/* 🔹 Opiniones con buscador */}
      {mostrarOpiniones && (
        <div className="opiniones-lista">
          <h3>💬 Opiniones de nuestros clientes</h3>

          <input
            type="text"
            placeholder="Buscar por palabra o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador-opiniones"
          />

          {opiniones.length > 0 ? (
            opiniones.map((op, i) => (
              <div key={i} className="opinion-item">
                <p>
                  <strong>{op.nombre}</strong> dijo:
                </p>
                <p>"{op.mensaje}"</p>
                <p className="opinion-fecha">
                  {new Date(op.fecha).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No hay opiniones para mostrar.</p>
          )}
        </div>
      )}

      {/* Formulario */}
      <div className="contacto-formulario">
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            rows="5"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          ></textarea>

          <button type="submit">Enviar</button>
        </form>

        {error && <div className="contacto-error">{error}</div>}
        {successMessage && (
          <div className="contacto-exito">{successMessage}</div>
        )}
      </div>

      <footer className="footer-contacto">
        <p>© 2025 VAPALEPEN | Todos los derechos reservados</p>
        <p>
          Dirección: 4578 Alberto Demiddi, Barrio Olímpico | Teléfono: +54 9 11
          61138645
        </p>
      </footer>
    </>
  );
}

export default ContactoSesion;

import "../src/contacto.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarUsuario from "./SidebarUsuario";
import { useCarrito } from "./carritocontext";
import SidebarCarrito from "./Carrito";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // 🔹 Animación Lottie

function ContactoSesion() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const { carrito } = useCarrito();
  const navigate = useNavigate();

  // 🔹 Nuevo estado para la animación de carga
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioData = localStorage.getItem("Usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }

    // ⏳ Simula una carga con animación
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
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

  // 🔥 Si está cargando, mostrar animación
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
      {/* Navbar */}
      <header className="contacto-navbar">
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
            <Link to="/Promociones/sesion">Promociones</Link>

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
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">

        </iframe>
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
      </div>

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

export default ContactoSesion;

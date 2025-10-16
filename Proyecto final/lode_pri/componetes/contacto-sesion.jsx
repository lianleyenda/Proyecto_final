import "../src/contacto.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarUsuario from "./SidebarUsuario"; // 🔹 Importa tu sidebar
import { useCarrito } from "./carritocontext";
import { useNavigate } from "react-router-dom";
import SidebarCarrito from "./Carrito";

function ContactoSesion() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [usuario, setUsuario] = useState(null); // 🔹 Estado del usuario
  const { carrito } = useCarrito(); // si querés usar carrito en el sidebar
  const navigate = useNavigate();

  // 🔹 Recuperar usuario del localStorage al cargar
  useEffect(() => {
    const usuarioData = localStorage.getItem("Usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
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

            {/* Sidebar de usuario */}
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
          title="Ubicación LODEPRI"
          src="https://www.google.com/maps/embed?pb=..."
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
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

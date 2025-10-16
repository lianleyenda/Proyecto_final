import "../src/contacto.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Animación de carga
  setTimeout(() => setLoading(false), 2000);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre || !email || !mensaje) {
      setError("Todos los campos son requeridos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  // 🕓 Pantalla de carga divertida
  if (loading) {
    return (
      <div className="loader-container">
        <DotLottieReact
          src="../src/assets/burger-loading.lottie"
          loop
          autoplay
        />
        <p className="loader-text">
          🍔 Estamos calentando la plancha para leer tu mensaje...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Promo arriba */}
      <div className="contacto-promo">
        <span>¿Tienes dudas o querés contactarnos? ¡Escribinos!</span>
      </div>
      <div className="contacto-root"></div>

      {/* Navbar */}
      <header className="contacto-navbar">
        <nav className="contacto-navbar">
          <div className="contacto-navbar-left">
            <Link to="/">
              <img src="img/lode_pri.png" alt="Logo LODEPRI" />
            </Link>
            <Link to="/">
              <span>LODEPRI</span>
            </Link>
          </div>
          <div className="contacto-navbar-right">
            <Link to="/">Página principal</Link>
            <Link to="/Contacto">Contacto</Link>
            <Link to="/Promociones">Promociones</Link>
            <Link to="/Login">Iniciar Sesión</Link>
          </div>
        </nav>
      </header>

      {/* Mensaje central */}
      <div className="contacto-mensage">
        <h2>📍 ¿Dónde nos encontramos?</h2>
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
        <p>🍔 Nuestra hamburguesa es única, con un sabor que no vas a olvidar.</p>
        <p>💬 ¡Contanos qué te pareció o mandanos tu consulta!</p>
        <h3>✍️ Envíanos tu mensaje</h3>
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
          Dirección: 4578 Alberto Demiddi, Barrio Olímpico | Teléfono: +54 9 11 61138645
        </p>
        <p>📱 Seguinos para más sabor y locuras hamburgueseras.</p>
      </footer>
    </>
  );
}

export default Contacto;

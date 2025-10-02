import "../src/contacto.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  return (
    <>
      {/* Promo arriba */}
      <div className="contacto-promo">
        <span>¿Tienes dudas o quieres contactarnos? ¡Escríbenos!</span>
      </div>
      <div className="contacto-root">
        {/* promo, navbar, mapa, formulario, footer */}
      </div>

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
        <h2>¡Estamos para ayudarte!</h2>
      </div>

      {/* Mapa */}
      <div className="contacto-mapa">
        <iframe
          title="Ubicación LODEPRI"
          src="https://www.google.com/maps/embed?pb=..."
          width="100%"
          height="350"
          style={{
            border: 0,
            borderRadius: "12px",
            display: "block",
            margin: "0 auto",
            maxWidth: "700px",
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Formulario */}
      <div className="contacto-formulario">
        <h3>Envíanos tu consulta</h3>
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

      <footer className="footer-contacto ">
<p>© 2025 VAPALEPEN | Todos los derechos reservados</p>
<h2></h2>
<p>Dirección: 4578 Alberto Demiddi, Barrio Olímpico | Teléfono de Contacto: +54 9 11 61138645</p>

<p>Síguenos en nuestras redes sociales para enterarte de nuestras ofertas y novedades.</p>

</footer>
    </>
  );
}

export default Contacto;

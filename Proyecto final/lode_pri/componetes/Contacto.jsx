import "../src/contacto.css";
import { useState } from "react";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de formulario
    if (!nombre || !email || !mensaje) {
      setError("Todos los campos son requeridos.");
      return;
    }

    // Enviar los datos a la API
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
      } else {
        setError(data.mensaje || "Hubo un problema al enviar tu mensaje.");
      }
    } catch (error) {
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <>
      <div className="contacto-promo">
        <span>¿Tienes dudas o quieres contactarnos? ¡Escríbenos!</span>
      </div>

      <header className="contacto-navbar">
        <nav className="contacto-navbar">
          <div className="contacto-navbar-left">
            <img src="img/lode_pri.png" alt="Logo LODEPRI" />
            <span>LODEPRI</span>
          </div>
          <div className="contacto-navbar-right">
            <a href="/">Página principal</a>
            <a href="#">Contacto</a>
            <a href="/Promociones">Promociones</a>
            <a href="/Login">Iniciar Sesión</a>
          </div>
        </nav>
      </header>

      <div className="contacto-mensage">
        <h2>¡Estamos para ayudarte!</h2>
      </div>

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

      <div className="contacto-formulario">
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="5"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          ></textarea>

          <button type="submit">Enviar</button>
        </form>

        {error && <div style={{ color: "red" }}>{error}</div>}
        {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      </div>

      <footer className="footer-contacto">
        <p>© 2025 VAPALEPEN | Todos los derechos reservados</p>
      </footer>
    </>
  );
}

export default Contacto;

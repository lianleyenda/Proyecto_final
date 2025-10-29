import { useState } from "react";
import { Link } from "react-router-dom";
import "../src/login.css";

export default function Olvido() {
  const [email, setEmail] = useState("");

  const handleEnviar = async (e) => {
    e.preventDefault(); // evita que recargue la página

    try {
      const res = await fetch("http://localhost:5000/olvide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email }),
      });

      const data = await res.json();
      alert(data.mensaje);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  };

  return (
    <div className="fondo">
      <div className="contenedor">
        <div className="card">
          <h1 className="titulo">Recuperar Contraseña</h1>
          <form onSubmit={handleEnviar}>
            <label className="label" htmlFor="email">
              Introduce tu dirección de correo electrónico
            </label>
            <input
              className="input"
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="submit" type="submit">
              <span style={{ marginRight: "8px" }}>✈️</span> Enviar
            </button>
          </form>
          <div className="links">
            <Link to="/Login">Volver</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

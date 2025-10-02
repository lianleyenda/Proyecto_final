import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../src/login.css";

export default function Registro() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async () => {
    // 🔹 Validación de correo Gmail
    const regexGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regexGmail.test(email)) {
      alert("El correo debe ser un Gmail válido (ejemplo: usuario@gmail.com)");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Usuario: usuario,
          Email: email,
          Password: password,
        }),
      });

      const data = await res.json();
      alert(data.mensaje);

      if (res.ok) {
        navigate("/Login");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="fondo">
      <div className="contenedor">
        <div className="card">
          <h1 className="titulo">🍔 Registro de usuario</h1>

          <input
            className="input"
            type="text"
            placeholder="Nombre"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <input
            className="input"
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="submit" onClick={handleRegistro}>
            Registrarse
          </button>

          <div className="links">
            <a href="/Login">← Volver</a>
          </div>
        </div>
      </div>
    </div>
  );
}

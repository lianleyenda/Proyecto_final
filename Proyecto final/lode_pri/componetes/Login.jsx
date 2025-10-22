import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "./carritocontext";
import "../src/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { vaciarCarrito } = useCarrito();
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regexGmail.test(email)) {
      mostrarMensaje(
        "⚠️ El correo debe ser un Gmail válido (ejemplo: usuario@gmail.com)"
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/inicio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Vaciar carrito y guardar usuario
        vaciarCarrito();
        localStorage.setItem("Email", JSON.stringify(email));
        localStorage.setItem("Usuario", JSON.stringify(data.usuario.Usuario));

        // Mostrar mensaje de bienvenida
        mostrarMensaje("😎 ¡Bienvenido de nuevo, crack del buen comer! 🍟");

        // Redirigir después de 2.5 segundos
        setTimeout(() => {
          navigate("/inicio");
        }, 2500);
      } else {
        mostrarMensaje(`❌ ${data.mensaje}`);
      }
    } catch (error) {
      console.error("Error en login:", error);
      mostrarMensaje("❌ Error al iniciar sesión. Inténtalo otra vez.");
    }
  };

  return (
    <div className="fondo">
      {mensaje && <div className="mensaje-alerta">{mensaje}</div>}
      <div className="contenedor">
        <div className="card">
          <h1 className="titulo">🍔 Bienvenido</h1>
          <form onSubmit={handleSubmit}>
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
            <button className="submit" type="submit">
              Ingresar
            </button>
          </form>

          <div className="links">
            <Link to="/olvide">¿Olvidaste tu contraseña?</Link>
            <Link to="/registro">¿No tienes cuenta? Regístrate</Link>
          </div>
        </div>
        <div className="volver">
          <Link to="/">← Volver</Link>
        </div>
      </div>
    </div>
  );
}

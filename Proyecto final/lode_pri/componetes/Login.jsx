import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "./carritocontext";
import "../src/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { vaciarCarrito } = useCarrito(); // 🔹 Hook del carrito
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regexGmail.test(email)) {
      alert("El correo debe ser un Gmail válido (ejemplo: usuario@gmail.com)");
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
        alert(data.mensaje);
        localStorage.setItem("Email", JSON.stringify(email));
        localStorage.setItem("Usuario", JSON.stringify(data.usuario.Usuario));

        vaciarCarrito(); // 🔹 Vaciar el carrito al iniciar sesión

        navigate("/inicio"); // 🔹 Redirige al home
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="fondo">
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

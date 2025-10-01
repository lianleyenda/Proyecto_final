import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // <-- Importar
import "../src/login.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // <-- inicializamos

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/inicio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje); // Inicio de sesión exitoso
        console.log("Usuario logueado:", data.usuario.Usuario);
         // Guardamos los datos del usuario en el localStorage
      localStorage.setItem("Usuario", JSON.stringify(data.usuario.Usuario));
         navigate("/inicio"); // <-- Redirige a la página principal
        // acá podés guardar el usuario en localStorage o Context
      } else {
        alert(data.mensaje); // Usuario no encontrado o contraseña incorrecta
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="fondo">
      <div className="contenedor">
        <div className="card">
          <h1 className="titulo">Bienvenido</h1>
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

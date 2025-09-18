import "../src/login.css";

export default function Registro() {
  return (
    <div className="fondo">
    <div className="contenedor">
      <div className="card">
        <h1 className="titulo">Registro de usuario</h1>

        <input className="input" type="text" placeholder="Nombre" />
        <input className="input" type="email" placeholder="Correo" />
        <input className="input" type="password" placeholder="Contraseña" />

        <button className="submit">Registrarse</button>

        <div className="links">
          <a href="/Login">← Volver</a>
        </div>
      </div>
    </div>
    </div>
  );
}

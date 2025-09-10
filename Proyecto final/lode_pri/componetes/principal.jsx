import "../src/App.css"
import { Link } from "react-router-dom";

function Inicio() {
  return (
    <>
      <div class="promo">
  <span>¡Hoy tu hambre tiene premio! 🍔 Comprá 2 hamburguesas y la tercera va de regalo —solo por tiempo limitado.</span>
  <button>Ir</button>
</div>

<header>
<nav class="navbar">
  <div class="navbar-left">
    <img src="logo.png" alt="Logo LODEPRI" />
    <span>LODEPRI</span>
  </div>

  <div class="navbar-right">
    <a href="#">Página principal</a>
    <a href="#">Contacto</a>
    <a href="#">Promociones</a>

    <div>
      <Link to="/Login">Iniciar Sesion</Link>
    </div>
  </div>
</nav>
</header>

      

      
        {/* Esto empuja el contenido abajo de la promo */}
        <div>
          <h2>este es el comienzo donde iría la foto</h2>
        </div>
        <div>
          <h2>aca irían las distintas hamburguesas</h2>
        </div>

      
    </>
  );
}

export default Inicio;




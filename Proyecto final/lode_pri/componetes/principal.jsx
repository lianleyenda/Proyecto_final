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
    <a href="/"><img src="img/lode_pri.png" alt="Logo LODEPRI" /></a>
    <a href="/"><span>LODEPRI</span></a>
  </div>

  <div class="navbar-right">
    <a href="#">Página principal</a>
    <a href="#">Contacto</a>
    <a href="#">Promociones</a>
    <a href="/Login">Iniciar Sesion</a>
    </div>
  
</nav>
</header>

      

      
        {/* Esto empuja el contenido abajo de la promo */}
        <div className="hero-imagen">
          
        
        <img src="img/imagen_incio.png" alt="Inicio"></img>
        </div>
        <div>
          <h2>aca irían las distintas hamburguesas</h2>
        </div>

      
    </>
  );
}

export default Inicio;




import "./App.css";
import Inicio from "../componetes/principal.jsx"
import Login from "../componetes/Login.jsx";
import SidebarCarrito from "../componetes/Carrito.jsx";
import Sesion from "../componetes/sesion.jsx";


function App() {
  return (
    <>
      
   <div>
    <Inicio></Inicio>
    <SidebarCarrito></SidebarCarrito>
    <Login></Login>
    <Sesion></Sesion>
      
    </div>
      
    </>
  );
}

export default App;

import { useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import "../src/Carrito.css" // estilos del sidebar
import { useCarrito } from "./carritocontext";

function SidebarCarrito() {
  const [isOpen, setIsOpen] = useState(false);
  const { carrito, total, eliminarItem, vaciarCarrito } = useCarrito();

  return (
    <>
      {/* Botón / Icono para abrir */}
      <button className="carrito-btn" onClick={() => setIsOpen(true)}>
        <TiShoppingCart size={40} />
      </button>

      {/* Overlay (oscurece el fondo) */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ✖
        </button>
        <h2>Tu carrito</h2>
        {carrito.length > 0 ? (
          <>
            <ul>
           {carrito.map((item) => (
          <li key={item.id_Stock}>
         <strong>{item.Producto}</strong> - ${item.Costo} x {item.cantidad} = ${item.Costo * item.cantidad}
         <button onClick={() => eliminarItem(item.id_Stock)}>Eliminar</button>
        </li>
         ))}
</ul>

            <h3>Total: ${total}</h3>
            <button onClick={vaciarCarrito}>Vaciar carrito</button>
          </>
        ) : (
          <p>Carrito vacío 😢</p>
        )}
      </div>
      
    </>
  );
}


export default SidebarCarrito;

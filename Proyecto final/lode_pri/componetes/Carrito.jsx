import { useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import "../src/Carrito.css" // estilos del sidebar
import { useCarrito } from "./carritocontext";

function SidebarCarrito() {
  const [isOpen, setIsOpen] = useState(false);
  const { carrito, total, eliminarItem, vaciarCarrito, incrementarItem, decrementarItem  } = useCarrito();

  return (
    <>
    <div className="tipografia">
      {/* Botón / Icono para abrir */}
      <button className="carrito-btn" onClick={() => setIsOpen(true)}>
        <TiShoppingCart size={30}/>
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
          <div className="pestaña">
            <ul>
  {carrito.map((item) => (
    <li key={item.id_Stock}>
      <strong>🍔 {item.Producto}</strong>

      {/* Controles de cantidad */}
      <div className="cantidad-badge">
        {item.cantidad > 1 ? (
          <button onClick={() => decrementarItem(item.id_Stock)} className="circle-btn">−</button>
        ) : (
          <button onClick={() => eliminarItem(item.id_Stock)} className="circle-btn">🗑</button>
        )}
        
        <span className="cantidad">{item.cantidad}</span>
        
        <button onClick={() => incrementarItem(item.id_Stock)} className="circle-btn">+</button>
      </div>

      <span className="precio">
        ${item.Costo} x {item.cantidad} = ${item.Costo * item.cantidad}
      </span>
    </li>
  ))}
</ul>


            <h3>Total: ${total}</h3>
            <button onClick={vaciarCarrito}>Vaciar carrito</button>
            </div>
          </>
        ) : (
          <p>Carrito vacío 😢</p>
        )}
        
      
      </div>
      </div>
    </>
  );
}


export default SidebarCarrito;

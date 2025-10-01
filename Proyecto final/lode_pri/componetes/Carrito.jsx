import { useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import "../src/Carrito.css" // estilos del sidebar

function SidebarCarrito() {
  const [isOpen, setIsOpen] = useState(false);

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
        <h2>Tu carrito 🛒</h2>
        <p>Aquí aparecerán los productos añadidos.</p>
      </div>
    </>
  );
}

export default SidebarCarrito;

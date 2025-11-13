import React, { useState, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { useCarrito } from "../componetes/carritocontext";
import "../src/Carrito.css";

function SidebarCarrito({ abrirAutomaticamente = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    carrito,
    carrito_promo,
    cargarCarrito,
    total,
    eliminarItem,
    eliminarItemPromo,
    vaciarCarrito,
    incrementarItem,
    decrementarItem,
    incrementarItemPromo,
    decrementarItemPromo,
  } = useCarrito();

  const actualizarCantidad = (id, tipo) => {
    const item = carrito.find((item) => item.id === id || item.id_Stock === id);
    const nuevaCantidad =
      tipo === "incrementar" ? item.cantidad + 1 : item.cantidad - 1;

    if (nuevaCantidad < 1) return;

    if (tipo === "incrementar") {
      incrementarItem(id);
    } else {
      decrementarItem(id);
    }
  };

  const handlePagar = () => {
    window.location.href = "/pago";
  };

  useEffect(() => {
    if (abrirAutomaticamente && carrito.length > 0) {
      setIsOpen(true);
    }
    console.log(carrito);
  }, [carrito, abrirAutomaticamente]);

  return (
    <div className="tipografia">
      <button className="carrito-btn" onClick={() => setIsOpen(true)}>
        <TiShoppingCart size={40} />
      </button>

      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ✖
        </button>

        <h2 style={{ color: "#023973" }}>Tu carrito</h2>

        {carrito.length > 0 ? (
          <div className="pestaña">
            {/* Productos */}
            <h3 style={{ color: "#023973" }}>🛒 Tus Productos</h3>
            <ul>
              {carrito.map((item) => (
                <li key={item.id}>
                  <span>{item.nombre}</span>
                  <span>${item.precio}</span>
                  <div className="cantidad-badge">
                    <button onClick={() => decrementarItem(item.id)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => incrementarItem(item.id)}>+</button>
                  </div>
                  <button onClick={() => eliminarItem(item.id)}>🗑</button>
                </li>
              ))}
            </ul>


            {/* <h3 style={{ color: "#023973" }}>🎁 Tus Promos</h3>
            <ul>
              {carrito_promo.map((item) => (
                <li key={item.id}>
                  <span>{item.nombre}</span>
                  <span>${item.precio}</span>
                  <div className="cantidad-badge">
                    <button onClick={() => decrementarItemPromo(item.id)}>
                      -
                    </button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => incrementarItemPromo(item.id)}>
                      +
                    </button>
                  </div>
                  <button onClick={() => eliminarItemPromo(item.id)}>🗑</button>
                </li>
              ))}
            </ul>
 */}

            <h3 className="pagar-vaciar-btn">Total: ${total}</h3>
            <div className="pagar-vaciar-btn">
              <button onClick={vaciarCarrito}>Vaciar carrito</button>
              <button onClick={handlePagar}>Pagar</button>
            </div>
          </div>
        ) : (
          <p>Carrito vacío 😢</p>
        )}
      </div>
    </div>
  );
}

export default SidebarCarrito;

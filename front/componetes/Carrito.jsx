import React, { useState, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { useCarrito } from "../componetes/carritocontext";
import "../src/Carrito.css";

function SidebarCarrito({ abrirAutomaticamente = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    carrito,
    total,
    eliminarItem,
    vaciarCarrito,
    incrementarItem,
    decrementarItem,
  } = useCarrito();

  // Actualizar cantidad en frontend (y podrías hacer fetch al backend si querés sincronizar)
  const actualizarCantidad = (id, tipo) => {
    const item = carrito.find((item) => item.id === id);
    const nuevaCantidad =
      tipo === "incrementar" ? item.cantidad + 1 : item.cantidad - 1;

    if (nuevaCantidad < 1) return;

    if (tipo === "incrementar") {
      incrementarItem(id);
    } else {
      decrementarItem(id);
    }
  };

  // Redirigir a la página de pago
  const handlePagar = () => {
    window.location.href = "/pago";
  };

  useEffect(() => {
    if (abrirAutomaticamente && carrito.length > 0) {
      setIsOpen(true);
    }
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
            <ul>
              {carrito.map((item) => (
                <li key={item.id}>
                  <strong>
                    {item.tipo === "promocion" ? "🎁" : "🍔"} {item.nombre}
                  </strong>

                  <div className="cantidad-badge">
                    {item.cantidad > 1 ? (
                      <button
                        onClick={() =>
                          actualizarCantidad(item.id, "decrementar")
                        }
                        className="circle-btn"
                      >
                        −
                      </button>
                    ) : (
                      <button
                        onClick={() => eliminarItem(item.id)}
                        className="circle-btn"
                      >
                        🗑
                      </button>
                    )}

                    <span className="cantidad">{item.cantidad}</span>

                    <button
                      onClick={() => actualizarCantidad(item.id, "incrementar")}
                      className="circle-btn"
                    >
                      +
                    </button>
                  </div>

                  <span className="precio">
                    ${item.Costo} x {item.cantidad} = $
                    {item.Costo * item.cantidad}
                  </span>
                </li>
              ))}
            </ul>
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

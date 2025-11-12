// src/CarritoContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export function useCarrito() {
  return useContext(CarritoContext);
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [carrito_promo, setCarrito_promo] = useState([]);
  const [total, setTotal] = useState(0);

  // 🔹 Cargar carrito desde backend
  const cargarCarrito = () => {
    fetch("http://127.0.0.1:5000/carrito", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.carrito) return;
        const carritoConCantidad = data.carrito.map((item) => ({
          ...item,
          cantidad: item.cantidad || 1,
          Costo: Number(item.Costo),
        }));
        setCarrito(carritoConCantidad);
        setTotal(
          carritoConCantidad.reduce(
            (acc, item) => acc + item.Costo * item.cantidad,
            0
          )
        );
      })
      .catch((err) => console.error("Error cargando carrito:", err));
  };

  useEffect(() => {
    cargarCarrito();
  }, []);

  // 🔹 Agregar producto o promoción
  const agregarCarrito = (id) => {
    fetch(`http://127.0.0.1:5000/carrito/agregar_producto/${id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => cargarCarrito())
      .catch((err) => console.error("Error agregando ítem:", err));
  };

  const agregarCarritoPromo = (id) => {
    fetch(`http://127.0.0.1:5000/carrito/agregar_promo/${id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => cargarCarrito())
      .catch((err) => console.error("Error agregando ítem:", err));
  };

  // 🔹 Eliminar producto o promoción
  const eliminarItem = (id) => {
    fetch(`http://127.0.0.1:5000/carrito/eliminar/${id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => cargarCarrito())
      .catch((err) => console.error("Error eliminando ítem:", err));
  };

  // 🔹 Vaciar carrito
  const vaciarCarrito = () => {
    fetch("http://127.0.0.1:5000/carrito/vaciar", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => cargarCarrito())
      .catch((err) => console.error("Error vaciando carrito:", err));
  };

  // 🔹 Incrementar cantidad
  const incrementarItem = (id) => {
    setCarrito((prev) => {
      const nuevoCarrito = prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      setTotal(
        nuevoCarrito.reduce((acc, item) => acc + item.Costo * item.cantidad, 0)
      );
      return nuevoCarrito;
    });
  };

  // 🔹 Decrementar cantidad
  const decrementarItem = (id) => {
    setCarrito((prev) => {
      const nuevoCarrito = prev.map((item) =>
        item.id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );
      setTotal(
        nuevoCarrito.reduce((acc, item) => acc + item.Costo * item.cantidad, 0)
      );
      return nuevoCarrito;
    });
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        total,
        agregarCarrito,
        agregarCarritoPromo,
        eliminarItem,
        vaciarCarrito,
        incrementarItem,
        decrementarItem,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

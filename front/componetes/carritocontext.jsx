
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
      const carritoProductos = data.carrito?.map((item) => ({
        ...item,
        cantidad: item.cantidad || 1,
        precio: Number(item.Costo), // 🔹 de Productos
      })) || [];

      const carritoPromos = data.carrito_promo?.map((item) => ({
        ...item,
        cantidad: item.cantidad || 1,
        precio: Number(item.precio), // 🔹 de Promos
      })) || [];

      setCarrito(carritoProductos);
      setCarrito_promo(carritoPromos);
      setTotal(data.total || 0);
    })
    .catch((err) => console.error("Error cargando carrito:", err));
};


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


  const eliminarItemPromo = (id) => {
    fetch(`http://127.0.0.1:5000/carrito/eliminar_promo/${id}`, {
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


   // 🔹 Incrementar cantidad
  const incrementarItemPromo = (id) => {
    setCarrito_promo((prev) => {
      const nuevoCarrito = prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      setTotal(
        nuevoCarrito.reduce((acc, item) => acc + <item className="precio"></item> * item.cantidad, 0)
      );
      return nuevoCarrito;
    });
  };

  // 🔹 Decrementar cantidad
  const decrementarItemPromo = (id) => {
    setCarrito_promo((prev) => {
      const nuevoCarrito = prev.map((item) =>
        item.id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );
      setTotal(
        nuevoCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
      );
      return nuevoCarrito;
    });
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        carrito_promo,
        total,
        agregarCarrito,
        agregarCarritoPromo,
        eliminarItem,
        cargarCarrito,
        eliminarItemPromo,
        vaciarCarrito,
        incrementarItem,
        decrementarItem,
        incrementarItemPromo,
        decrementarItemPromo,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

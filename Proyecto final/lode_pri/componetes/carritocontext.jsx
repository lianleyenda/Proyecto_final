// src/CarritoContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext =
  createContext(); /* es como una "caja" donde guardás datos globales
(ejemplo: usuario logueado, carrito de compras, tema claro/oscuro).
Se usa una vez y después todos los componentes pueden leerlo
*/

export function useCarrito() {
  return useContext(
    CarritoContext
  ); /* useContext Es un hook que te permite leer el contexto desde cualquier
 componente.En vez de pasar props de un componente padre a hijo, usás useContext y accedés directo.*/
}

export function CarritoProvider({ children }) {
  /*children En React, children es una prop
especial que representa todo lo que está dentro de un componente.*/
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  // Cargar carrito desde el backend
  const cargarCarrito = () => {
    fetch("http://127.0.0.1:5000/carrito", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const carritoConCantidad = data.carrito.map((item) => ({
          ...item, //abre el item con el operador
          cantidad: item.cantidad || 1,
          Costo: Number(item.Costo), // Asegurarse que sea número
        }));
        setCarrito(carritoConCantidad);
        setTotal(
          carritoConCantidad.reduce(
            (acc, item) => acc + item.Costo * item.cantidad,
            0 //El método reduce() recorre un array y acumula un valor a lo largo de todas sus iteraciones
          )
        );
      })
      .catch((err) => console.error("Error cargando carrito:", err));
  };

  useEffect(() => {
    cargarCarrito();
  }, []);

  // Agregar producto
  const agregarCarrito = (id) => {
    fetch(`http://127.0.0.1:5000/carrito/agregar/${id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        cargarCarrito();
      })
      .catch((err) => console.error("Error agregando producto:", err));
  };

  const eliminarItem = (id) => {
    fetch(`http://127.0.0.1:5000/carrito/eliminar/${id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        cargarCarrito();
      })
      .catch((err) => console.error("Error eliminando producto:", err));
  };

  // -----------------------------
  // Vaciar carrito
  // -----------------------------
  const vaciarCarrito = () => {
    fetch("http://127.0.0.1:5000/carrito/vaciar", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        cargarCarrito();
      })
      .catch((err) => console.error("Error vaciando carrito:", err));
  };

  const incrementarItem = (id) => {
    setCarrito((prev) => {
      const nuevoCarrito = prev.map((item) =>
        item.id_Stock === id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      setTotal(
        nuevoCarrito.reduce((acc, item) => acc + item.Costo * item.cantidad, 0)
      );
      return nuevoCarrito;
    });
  };

  const decrementarItem = (id) => {
    setCarrito((prev) => {
      const nuevoCarrito = prev.map((item) =>
        item.id_Stock === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );
      setTotal(
        nuevoCarrito.reduce((acc, item) => acc + item.Costo * item.cantidad, 0)
      );
      return nuevoCarrito;
    });
  };

  // Agregar producto o promoción
  const agregarCarritoPromo = (id1) => {
    fetch(`http://127.0.0.1:5000/carrito/agregarPromo/${id1}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        cargarCarrito();
      })
      .catch((err) => console.error("Error agregando producto:", err));
  };

  const eliminarItemPromo = (id) => {
    fetch(`http://127.0.0.1:5000/carrito/eliminar/promo/${id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        cargarCarrito();
      })
      .catch((err) => console.error("Error eliminando producto:", err));
}
  return (
    //.Provider es el componente que “proporciona” los datos a todos los hijos que usen useCarrito()
    <CarritoContext.Provider
      value={{
        carrito,
        total,
        agregarCarrito,
        eliminarItem,
        vaciarCarrito,
        incrementarItem,
        decrementarItem,
        agregarCarritoPromo,
        eliminarItemPromo,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

// src/CarritoContext.jsx
import { createContext, useContext, useState, useEffect } from "react";


const CarritoContext = createContext();/* es como una "caja" donde guardás datos globales
(ejemplo: usuario logueado, carrito de compras, tema claro/oscuro).
Se usa una vez y después todos los componentes pueden leerlo
*/


export function useCarrito() {
 return useContext(CarritoContext);/* useContext Es un hook que te permite leer el contexto desde cualquier
 componente.En vez de pasar props de un componente padre a hijo, usás useContext y accedés directo.*/
}


export function CarritoProvider({ children }) {  /*children En React, children es una prop
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
        console.log("Carrito desde backend:", data);
        const carritoConCantidad = data.carrito.map((item) => ({
          ...item,
          cantidad: item.cantidad || 1,
          Costo: Number(item.Costo), // Asegurarse que sea número
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


 // Agregar producto
const agregarCarrito = (id) => {
    fetch(`http://127.0.0.1:5000/carrito/agregar/${id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta de agregar producto:", data);
        cargarCarrito();
      })
      .catch((err) => console.error("Error agregando producto:", err));
  };;


  const eliminarItem = (id) => {
    fetch(`http://127.0.0.1:5000/carrito/eliminar/${id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta eliminar:", data);
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
      console.log("Carrito vaciado:", data);
      cargarCarrito();
    })
    .catch((err) => console.error("Error vaciando carrito:", err));
};


const incrementarItem = (id) => {
  setCarrito((prev) => {
    const nuevoCarrito = prev.map((item) =>
      item.id_Stock === id ? { ...item, cantidad: item.cantidad + 1 } : item
    );
    setTotal(nuevoCarrito.reduce((acc, item) => acc + item.Costo * item.cantidad, 0));
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
    setTotal(nuevoCarrito.reduce((acc, item) => acc + item.Costo * item.cantidad, 0));
    return nuevoCarrito;
  });
};




 return (
   //.Provider es el componente que “proporciona” los datos a todos los hijos que usen useCarrito()
   <CarritoContext.Provider value={{ carrito, total, agregarCarrito, eliminarItem, vaciarCarrito, incrementarItem, decrementarItem  }}> 
     {children}
   </CarritoContext.Provider>
 );
}

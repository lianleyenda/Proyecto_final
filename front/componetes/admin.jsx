import { useEffect, useState } from "react";
import "../src/App.css";

function Admin() {
  const [menu, setMenu] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    Producto: "",
    Costo: "",
    Imagen: "",
  });

  // 📦 Cargar menú
  useEffect(() => {
    fetch("http://127.0.0.1:5000/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error(err));
  }, []);

  // ➕ Agregar producto
  const agregarProducto = async (e) => {
    e.preventDefault();

    // if (!nuevoProducto.Producto || !nuevoProducto.Costo) {
    //   alert("El nombre y costo son obligatorios");
    //   return;
    // }

    try {
      // Crear un objeto FormData para enviar los datos
      const formData = new FormData();
      formData.append("Producto", nuevoProducto.Producto);
      formData.append("Costo", nuevoProducto.Costo);
      formData.append("Imagen", nuevoProducto.Imagen); // Agregar la imagen

      const res = await fetch("http://127.0.0.1:5000/admin/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Producto agregado correctamente");
        setMenu([...menu, { id_Precio: data.id, ...nuevoProducto }]);
        setNuevoProducto({
          Producto: "",
          Costo: "",
          Imagen: null,
        });
      } else {
        alert(data.error || "❌ Error al agregar producto");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error al conectar con el servidor");
    }
  };

  // 🗑️ Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este producto?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/admin/productos/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.mensaje);
        setMenu(menu.filter((item) => item.id_Precio !== id));
      } else {
        alert("Error al eliminar producto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🚪 Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  return (
    <div>
      <header className="header-admin">
        <nav className="navbar-navegacion">
          <div className="navbar-left">
            <a href="/inicio/admin">
              <img src="/img/lode_pri.png" alt="Logo" />
            </a>
            <span>Panel de Administración</span>
          </div>

          <div className="navbar-right">
            <a href="/inicio">Ver como usuario</a>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </div>
        </nav>
      </header>

      <div className="contenedor-admin">
        <h2>Gestión de productos</h2>

        {/* 🧾 Formulario para agregar producto */}
        <form onSubmit={agregarProducto} className="form-admin">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nuevoProducto.Producto}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, Producto: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Costo"
            value={nuevoProducto.Costo}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, Costo: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, Imagen: e.target.files[0] })
            }
          />

          <button type="submit">Agregar producto</button>
        </form>

        {/* 📋 Lista de productos */}
        <div className="producto">
          <ul>
            {menu.map((item) => (
              <ol key={item.id_Precio}>
                <img src={`img/${item.Imagen}`} alt={item.Producto} />
                <h3>{item.Producto}</h3>
                <p>Precio: ${item.Costo}</p>
                <button onClick={() => eliminarProducto(item.id_Precio)}>
                  🗑️ Eliminar
                </button>
              </ol>
            ))}
          </ul>
        </div>
      </div>

      <footer className="derechos">
        <p>© 2025 VAPALEPEN | Panel Admin</p>
      </footer>
    </div>
  );
}

export default Admin;

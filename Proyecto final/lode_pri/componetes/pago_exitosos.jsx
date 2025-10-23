import { useEffect } from "react";
import { useCarrito } from "../componetes/carritocontext";
import "../src/pago-exitoso.css"

export default function PagoExitoso() {
  const { vaciarCarrito } = useCarrito();

  useEffect(() => {
    vaciarCarrito();
  }, []);

  return (
    <div className="fondo-pago">
      <div className="card-pago">
        <h1>✅ ¡Pago exitoso!</h1>
        <p>Gracias por tu compra 🎉</p>
        <a href="/inicio">Volver al inicio</a>
      </div>
    </div>
  );
}

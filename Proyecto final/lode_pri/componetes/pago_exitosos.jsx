import { useEffect } from "react";
import { useCarrito } from "../componetes/carritocontext";

export default function PagoExitoso() {
  const { vaciarCarrito } = useCarrito();

  useEffect(() => {
    vaciarCarrito();
  }, []);

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-green-600 color:black">
        ✅ ¡Pago exitoso!
      </h1>
      <p>Gracias por tu compra 🎉</p>
      <a href="/inicio" className="text-blue-500 underline">
        Volver al carrito
      </a>
    </div>
  );
}

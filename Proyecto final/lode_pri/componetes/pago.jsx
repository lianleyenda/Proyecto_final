// Pago.jsx
import React, { useState } from "react";
import cardValidator from "card-validator";
import { useCarrito } from "./carritocontext";

function Pago() {
  const { carrito, total } = useCarrito();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Validación de la tarjeta
  const validateCard = () => {
    const cardValidation = cardValidator.number(cardNumber);
    const expiryValidation = cardValidator.expirationDate(expiryDate);
    const cvvValidation = cardValidator.cvv(cvv);

    if (!cardValidation.isValid || !expiryValidation.isValid || !cvvValidation.isValid) {
      setError("Por favor, revisa los datos de la tarjeta.");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid) {
      // Aquí puedes realizar el pago, por ejemplo, con Stripe
      // O enviarlo al backend para procesar el pago
      alert("Pago realizado con éxito");

      // Redirigir a la página de confirmación usando window.location.href
      window.location.href = "/confirmacion"; // Redirigir a la confirmación de pago
    } else {
      console.log("Datos de la tarjeta inválidos");
    }
  };

  return (
    <div>
      <h2>Confirmar pago</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cardNumber">Número de tarjeta</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            onBlur={validateCard}
            placeholder="Ingrese el número de tarjeta"
          />
        </div>
        <div>
          <label htmlFor="expiryDate">Fecha de expiración</label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            onBlur={validateCard}
            placeholder="MM/AA"
          />
        </div>
        <div>
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            onBlur={validateCard}
            placeholder="CVV"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <h3>Total a pagar: ${total}</h3>
          <button type="submit" disabled={!isValid}>
            Confirmar pago
          </button>
        </div>
      </form>
    </div>
  );
}

export default Pago;

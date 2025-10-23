// Pago.jsx
import React, { useState } from "react";
import cardValidator from "card-validator";
import { useCarrito } from "./carritocontext";
import "../src/pago.css";

function Pago() {
  const { carrito, total } = useCarrito();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // ✅ Manejar cambios en fecha de expiración (MM/YY)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // solo dígitos
    if (val.length > 4) val = val.slice(0, 4);

    // limitar mes a 12
    if (val.length >= 2) {
      let mm = val.slice(0, 2);
      if (Number(mm) > 12) mm = "12";
      else if (Number(mm) === 0) mm = "01";
      val = mm + val.slice(2);
    }

    // formatear con "/"
    if (val.length > 2) {
      setExpiryDate(val.slice(0, 2) + "/" + val.slice(2));
    } else {
      setExpiryDate(val);
    }
  };

  // ✅ Manejar cambios en CVV (solo 3 dígitos)
  const handleCvvChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setCvv(onlyDigits.slice(0, 4));
  };

  // ✅ Validación completa
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

  // ✅ Envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid) {
      window.location.href = "/pago/exitoso";
    } else {
      console.log("Datos de la tarjeta inválidos");
    }
  };

  return (
    <div className="pago-fondo">
      <div className="pago-container">
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
              onChange={handleExpiryChange}
              onBlur={validateCard}
              placeholder="MM/AA"
              maxLength={5}
              inputMode="numeric"
            />
          </div>

          <div>
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={handleCvvChange}
              onBlur={validateCard}
              placeholder="CVV"
              maxLength={4}
              inputMode="numeric"
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <h3 className="pago-total">Total a pagar: ${total}</h3>
          <button className="pago-boton" type="submit" disabled={!isValid}>
            Confirmar pago
          </button>
        </form>
      </div>
    </div>
  );
}

export default Pago;

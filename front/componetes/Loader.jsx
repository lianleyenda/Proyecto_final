// src/components/Loader.jsx
import React from "react";
import "../src/Loader.css";

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="burger-loader">
        <div className="bun top"></div>
        <div className="patty"></div>
        <div className="bun bottom"></div>
      </div>
      <p>Cargando...</p>
    </div>
  );
}

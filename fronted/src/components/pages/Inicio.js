import React from "react";
import "./Inicio.css"; // Asegúrate de importar el archivo de estilos

export default function Inicio() {
    return (
        <div className="marquee-container bg-dark">
            <p className="marquee-text fw-bold text-white">
                Hola, bienvenidos a mi página
            </p>
        </div>
        // <Carrusel />  // Si quieres incluir el Carrusel, descoméntalo
    );
}

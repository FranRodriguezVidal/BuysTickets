import React, { useEffect, useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/mensaje") // Llamamos a Flask
      .then(response => response.json())
      .then(data => setMensaje(data.mensaje))
      .catch(error => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h1>React + Flask</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;

import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Container } from "react-bootstrap";
import Carrusel from "./components/Carrusel";
import NavBar from "./components/NavBar";

const Inicio = () => {
  return (
    <>
      <NavBar />
      <Container>
        <Carrusel />
      </Container>
    </>
  );
};

export default Inicio;
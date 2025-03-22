import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Container } from "react-bootstrap";
import Carrusel from "./components/Carrusel";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

const Inicio = () => {
  return (
    <>
      <NavBar />
      <Container>
        <Carrusel />
      </Container>
      <Footer />
    </>
  );
};

export default Inicio;
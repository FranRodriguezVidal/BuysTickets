import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FaTicketAlt, FaUser } from "react-icons/fa"; // Cambié el icono de Iniciar Sesión a FaUser
import "./NavBar.css"; // Importa correctamente los estilos

const NavBar = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand href="#home">
                    <img 
                        src="/images/logo.png" 
                        alt="Logo" 
                        className="custom-logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#home">Inicio</Nav.Link>
                        <Nav.Link href="#about">Sobre Nosotros</Nav.Link>
                        <Nav.Link href="#contact">Contacto</Nav.Link>
                        <Nav.Link href="#entradas">
                        <FaTicketAlt size={26}/> Entradas
                        </Nav.Link>
                        <Nav.Link href="#login">
                        <FaUser size={20}/> Iniciar Sesión
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;

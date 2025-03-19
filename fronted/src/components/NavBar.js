import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand href="#home">Mi Sitio</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#home">Inicio</Nav.Link>
                        <Nav.Link href="#about">Sobre Nosotros</Nav.Link>
                        <Nav.Link href="#contact">Contacto</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;

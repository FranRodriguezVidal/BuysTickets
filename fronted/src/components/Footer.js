import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"; // Importa los iconos
import "./Footer.css"; // Importa los estilos

const Footer = () => {
    return (
        <footer className="footer bg-dark text-light py-4">
            <Container>
                <Row>
                    <Col md={4} className="text-center text-md-start">
                        <h4>Condiciones</h4>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-light text-decoration-none">Licencias</a></li>
                            <li><a href="#" className="text-light text-decoration-none">Condiciones de Política</a></li>
                            <li><a href="#" className="text-light text-decoration-none">Política de Privacidad y Cookies</a></li>
                        </ul>
                    </Col>
                    <Col md={4} className="text-center">
                        <h5>Redes Sociales</h5>
                        <div className="social-icons">
                            <a href="#" className="text-light mx-3" aria-label="Facebook">
                                <FaFacebook size={30} />
                            </a>
                            <a href="#" className="text-light mx-3" aria-label="Twitter">
                                <FaTwitter size={30} />
                            </a>
                            <a href="#" className="text-light mx-3" aria-label="Instagram">
                                <FaInstagram size={30} />
                            </a>
                        </div>
                        <h5 className="mt-4">BuysTickets</h5>
                        <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
                    </Col>
                    <Col md={4} className="text-center text-md-end">
                        <h5>Contacto</h5>
                        <p>Email: <a href="mailto:buystickets@buystickets.com" className="text-light text-decoration-none">buystickets@buystickets.com</a></p>
                        <p>Teléfono: <a href="tel:+34999999999" className="text-light text-decoration-none">+34 999 99 99 99</a></p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;

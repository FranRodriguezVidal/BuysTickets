import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Dropdown, Form, Modal, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaCog, FaGlobe, FaSignOutAlt, FaTicketAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import i18n from "../traduccion/i18n";
import "./NavBar.css";

const NavBar = () => {
    const [usuario, setUsuario] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("estandar");
    const [profile, setProfile] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [language, setLanguage] = useState(localStorage.getItem("language") || "es"); // Idioma predeterminado
    const { t } = useTranslation();

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
    }, []);

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post("http://127.0.0.1:5000/login", { user, password });

            if (response.data.success) {
                const usuarioData = {
                    nombre: response.data.nombre,
                    apellido: response.data.apellido,
                    role: response.data.role,
                    profile: response.data.profile || null // Guardar la imagen si existe
                };

                setUsuario(usuarioData);
                localStorage.setItem("usuario", JSON.stringify(usuarioData));
                setShowLogin(false);
                setUser("");
                setPassword("");
                alert("Has iniciado sesion correctamente.");
                window.location.reload();
            } else {
                setError("Usuario o contraseña incorrectos.");
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
        }
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const formData = new FormData();
        formData.append("user", user);
        formData.append("password", password);
        formData.append("nombre", nombre);
        formData.append("apellido", apellido);
        formData.append("email", email);
        formData.append("profile", profile); // Imagen de perfil

        try {
            const response = await axios.post("http://127.0.0.1:5000/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                setSuccessMessage("Registro exitoso. Ahora puedes iniciar sesión.");
                setShowRegister(false);
                setShowLogin(true);
                setUser("");
                setNombre("");
                setApellido("");
                setEmail("");
                setPassword("");
                setProfile(null);
                alert("Registrado correctamente.");
            } else {
                setError(response.data.message || "Error al registrar usuario.");
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
        }
    };



    const handleLogout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario");
        alert("Has cerrado sesión correctamente.");
        window.location.reload();
    };

    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/inicio">
                        <img src="/images/logo.png" alt="Logo" className="custom-logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto"> {/* Centra los enlaces */}
                            <Nav.Link href="/inicio">{t("Inicio")}</Nav.Link>
                            <Nav.Link href="/eventos">{t("Eventos")}</Nav.Link>
                            <Nav.Link href="#contact">{t("Contacto")}</Nav.Link>
                        </Nav>

                        {usuario ? (
                            <Nav className="ms-auto me-5"> {/* Alinea a la derecha */}
                                <NavDropdown
                                    title={
                                        <>
                                            {usuario.profile ? (
                                                <img
                                                    src={usuario.profile}
                                                    alt="Perfil"
                                                    className="profile-image me-2"
                                                />
                                            ) : (
                                                <FaUser className="me-1" />
                                            )}
                                            {t("¡Hola")}, {usuario.nombre} {usuario.apellido}!
                                        </>
                                    }
                                    id="user-dropdown"
                                >
                                    {usuario?.role === "estandar" && (
                                        <>
                                            <NavDropdown.Item href="#entradas">
                                                <FaTicketAlt className="me-2" /> {t("Mis Entradas")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/configuracion">
                                                <FaCog className="me-2" /> {t("Configuración")}
                                            </NavDropdown.Item>
                                        </>
                                    )}

                                    {usuario?.role === "admin" && (
                                        <>
                                            <NavDropdown.Item href="#admin-dashboard">
                                                <FaCog className="me-2" /> {t("Administrar")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item href="#usuarios">
                                                <FaUser className="me-2" />  {t("Usuarios")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item href="#ventas">
                                                <FaTicketAlt className="me-2" /> {t("Eventos")}
                                            </NavDropdown.Item>
                                        </>
                                    )}

                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        <FaSignOutAlt className="me-2" /> {t("Cerrar Sesión")}
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        ) : (
                            <Nav className="ms-auto me-5"> {/* Alinea a la derecha */}
                                <Nav.Link onClick={() => setShowLogin(true)}>
                                    <FaUser className="me-1" /> {t("Iniciar Sesión")}
                                </Nav.Link>
                            </Nav>
                        )}

                        <Dropdown className="me-3">
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                <FaGlobe className="me-1" /> {t("Idioma")}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleLanguageChange("es")}>
                                    <img src="https://flagcdn.com/w40/es.png" alt="Español" className="me-2" width="25" /> Español
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleLanguageChange("en")}>
                                    <img src="https://flagcdn.com/w40/gb.png" alt="English" className="me-2" width="25" /> English
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleLanguageChange("pl")}>
                                    <img src="https://flagcdn.com/w40/pl.png" alt="Polski" className="me-2" width="25" /> Polski
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleLanguageChange("ar")}>
                                    <img src="https://flagcdn.com/w40/sa.png" alt="العربية" className="me-2" width="25" /> العربية
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </Navbar.Collapse>
                </Container>
            </Navbar>


            {/* Modal de Inicio de Sesión */}
            <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Iniciar Sesión")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Usuario")}</Form.Label>
                            <Form.Control type="text" value={user} onChange={(e) => setUser(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Contraseña")}</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">{t("Iniciar Sesión")}</Button>
                    </Form>
                    <div className="text-center mt-3">
                        <p>{t("¿No tienes cuenta?")}<Button variant="link" onClick={() => { setShowLogin(false); setShowRegister(true); }}>{t("Registrarse")}</Button></p>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal de Registro */}
            <Modal show={showRegister} onHide={() => setShowRegister(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Crear Cuenta")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Usuario")}</Form.Label>
                            <Form.Control type="text" value={user} onChange={(e) => setUser(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Nombre")}</Form.Label>
                            <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Apellido")}</Form.Label>
                            <Form.Control type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Correo Electrónico")}</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Contraseña")}</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Imagen de Perfil")}</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(e) => setProfile(e.target.files[0])} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">{t("Registrarse")}</Button>
                    </Form>
                    <div className="text-center mt-3">
                        <p>{t("Tienes una cuenta")}<Button variant="link" onClick={() => { setShowLogin(true); setShowRegister(false); }}>{t("Iniciar Sesión")}</Button></p>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NavBar;

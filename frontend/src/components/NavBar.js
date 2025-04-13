import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Dropdown, Form, InputGroup, Modal, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaCog, FaGlobe, FaMicrophone, FaSearch, FaSignOutAlt, FaTicketAlt, FaUser } from "react-icons/fa";
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
    const [searchQuery, setSearchQuery] = useState(""); // Agregado para la búsqueda

    useEffect(() => {
        const verificarUsuario = async () => {
            const usuarioGuardado = localStorage.getItem("usuario");
            if (!usuarioGuardado) return;

            const parsedUser = JSON.parse(usuarioGuardado);

            try {
                const response = await axios.post("http://localhost:5000/verify-user", {
                    user: parsedUser.nombre,
                });

                if (!response.data.exists) {
                    localStorage.removeItem("usuario");
                    setUsuario(null);
                    alert("Tu sesión ha expirado o el usuario fue eliminado.");
                    window.location.href = "/inicio";
                }
                
            } catch (err) {
                console.error("Error al verificar el usuario:", err);
            }
        };

        verificarUsuario();
    }, []);


    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const handleSearch = () => {
        console.log("Buscando:", searchQuery);
    };
    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Tu navegador no soporta el reconocimiento de voz.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = language; // Usa el idioma seleccionado
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => console.log("Escuchando...");
        recognition.onend = () => console.log("Detenido");

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
        };

        recognition.start();
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post("http://127.0.0.1:5000/login", { user, password });
    
            if (response.data.success) {
                const usuarioData = {
                    user,                          // Nombre de usuario
                    nombre: response.data.nombre,   // Nombre real del usuario
                    apellido: response.data.apellido, // Apellido real
                    email: response.data.email,     // Email (si lo tienes en la base de datos)
                    role: response.data.role,       // Rol del usuario
                    profile: response.data.profile || null  // Imagen de perfil si existe
                };
    
                // Guardamos el objeto usuario completo en localStorage
                localStorage.setItem("usuario", JSON.stringify(usuarioData));
    
                setUsuario(usuarioData);  // También actualizamos el estado para que el navbar lo reconozca
                setShowLogin(false);
                setUser("");   // Limpiamos los campos del formulario
                setPassword(""); 
                alert("Has iniciado sesión correctamente.");
                // No recargues la página, solo actualiza el estado
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
        // NO uses reload. Si estás usando React Router, podrías redirigir:
        window.location.href = "/inicio";
    };
    

    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg" className="sticky-top">
                <Container>
                    <Navbar.Brand href="/inicio">
                        <img src="/images/logo.png" alt="Logo" className="custom-logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto"> {/* Centra los enlaces */}
                            <Nav.Link className="" href="/inicio">{t("Inicio")}</Nav.Link>
                            <Nav.Link className="me-5" href="/eventos">{t("Eventos")}</Nav.Link>
                            <InputGroup className="ms-5" style={{ width: '90%' }}>
                                <Form.Control
                                    type="text"
                                    placeholder={t("Buscar...")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button variant="light" onClick={handleSearch}>
                                    <FaSearch />
                                </Button>
                                <Button variant="light" onClick={handleVoiceSearch}>
                                    <FaMicrophone />
                                </Button>
                            </InputGroup>
                        </Nav>
                        {usuario ? (
                            <Nav className="me-5"> {/* Alinea a la derecha */}
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
                                    <img src="https://flagcdn.com/w40/ae.png" alt="العربية" className="me-2" width="25" /> العربية
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

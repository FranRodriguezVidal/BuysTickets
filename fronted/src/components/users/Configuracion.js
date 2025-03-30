import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Configuracion = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        if (!usuario) {
            setShowLogin(true); 
        }
    }, [usuario]);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email || !password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/update-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, user: usuario?.nombre }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                throw new Error(data.message || "Error al actualizar los datos.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post("http://127.0.0.1:5000/login", { user, password: passwordLogin });

            if (response.data.success) {
                const usuarioData = {
                    nombre: response.data.nombre,
                    apellido: response.data.apellido,
                    role: response.data.role,
                    profile: response.data.profile || null,
                };

                localStorage.setItem("usuario", JSON.stringify(usuarioData));
                setShowLogin(false);
                setUser("");
                setPasswordLogin("");
                window.location.reload(); 
            } else {
                setError("Usuario o contraseña incorrectos.");
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Container className="p-4 shadow-lg rounded" style={{ maxWidth: "400px", backgroundColor: "#f8f9fa" }}>
                {usuario ? (
                    <>
                        <h2 className="text-center mb-4">Configuración</h2>
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSaveChanges}>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Introduce tu nuevo correo" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nueva Contraseña</Form.Label>
                                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Introduce tu nueva contraseña" />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">Guardar Cambios</Button>
                        </Form>
                    </>
                ) : (
                    <Modal show={showLogin} onHide={() => navigate("/inicio")} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Iniciar Sesión</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control type="text" value={user} onChange={(e) => setUser(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control type="password" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} required />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">Iniciar Sesión</Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                )}
            </Container>
        </div>
    );
};

export default Configuracion;

import React, { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";

const Configuracion = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const user = "nombre_de_usuario"; // ⚠️ Esto debe venir de la sesión del usuario autenticado

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const response = await fetch("http://localhost:5000/update-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, user }),
        });

        const data = await response.json();
        
        if (data.success) {
            setMessage(data.message);
        } else {
            setError(data.message);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Configuración de Usuario</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSaveChanges}>
                <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Introduce tu nuevo correo"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nueva Contraseña</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Introduce tu nueva contraseña"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Guardar Cambios</Button>
            </Form>
        </Container>
    );
};

export default Configuracion;

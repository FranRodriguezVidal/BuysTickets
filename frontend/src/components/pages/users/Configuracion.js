import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Container, Form, Modal, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

 // Importar el contexto

const Configuracion = () => {
    const { setUser, logOut } = useContext(AuthContext); // Usar el contexto
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        const verificarUsuario = async () => {
            if (!usuario || !usuario.user) {
                localStorage.removeItem("usuario");
                navigate("/inicio");
                return;
            }

            try {
                const response = await axios.post("http://localhost:5000/verify-user", {
                    user: usuario.user,
                });

                if (!response.data.exists) {
                    localStorage.removeItem("usuario");
                    navigate("/inicio");
                }
            } catch (err) {
                console.error("Error al verificar el usuario:", err);
                localStorage.removeItem("usuario");
                navigate("/inicio");
            }
        };

        verificarUsuario();
    }, []);

    const handleDeleteAccount = async () => {
        setMessage("");
        setError("");
        setLoading(true);

        if (!password) {
            setError("Debes ingresar tu contraseña para confirmar.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.delete("http://localhost:5000/delete-user", {
                data: {
                    user: usuario?.user,
                    password: password,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                setMessage(response.data.message); 
                setTimeout(() => {
                    logOut(); // Eliminar el usuario del estado global
                    setShowPasswordModal(false); // Cerrar modal
                    navigate("/inicio"); // Redirigir
                }, 3000);
            } else {
                setError(response.data.message || "Error al eliminar la cuenta.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Container
                className="p-4 rounded mt-5 text-center"
                style={{ maxWidth: "90%", backgroundColor: "#f8f9fa", boxShadow: "0px 16px 32px rgba(0, 26, 255, 0.6)" }}
            >
                <h2 className="mb-4">{t("Configuración")}</h2>
                <h2 className="mb-4">{t("Premium")}</h2>
            </Container>

            <Container
                className="p-4 rounded my-5 text-center"
                style={{ maxWidth: "90%", backgroundColor: "#f8f9fa", boxShadow: "0px 16px 32px rgba(255, 0, 0, 0.6)" }}
            >
                <h2 className="mb-4">{t("Zona peligrosa")}</h2>
                <p>{t("Si eliminas tu cuenta:")}</p>
                <ul className="list-unstyled">
                    <li>{t("No podrás comprar más entradas")}</li>
                    <li>{t("Toda tu información será eliminada permanentemente")}</li>
                    <li>{t("Las entradas impresas o descargadas podrían seguir siendo válidas, pero no podrás acceder a ellas desde tu cuenta")}</li>
                </ul>
                <Button variant="danger" onClick={() => setShowPasswordModal(true)}>
                    {t("Borrar mi cuenta")}
                </Button>
                {message && <Alert variant="success" className="mt-3">{message}</Alert>}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Container>

            {/* Modal para confirmar eliminación */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Confirmar eliminación de cuenta")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message ? (
                        <Alert variant="success">
                            {message}
                        </Alert>
                    ) : (
                        <Form onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(); }}>
                            <Form.Group className="mb-3">
                                <Form.Label>{t("Contraseña")}:</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("Introduce tu contraseña")}
                                    required
                                />
                            </Form.Group>
                            <Button variant="danger" type="submit" className="w-100" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        {t("Cargando...")}
                                    </>
                                ) : (
                                    t("Confirmar y eliminar cuenta")
                                )}
                            </Button>
                        </Form>
                    )}
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Configuracion;

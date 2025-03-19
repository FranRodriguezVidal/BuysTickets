import React from "react";
import { Carousel } from "react-bootstrap";

const Carrusel = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/1200x500/FF5733/FFFFFF?text=Imagen+1"
                    alt="Primera imagen"
                />
                <Carousel.Caption>
                    <h3>Primera imagen</h3>
                    <p>Texto accesible con buen contraste</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/1200x500/33FF57/000000?text=Imagen+2"
                    alt="Segunda imagen"
                />
                <Carousel.Caption>
                    <h3>Segunda imagen</h3>
                    <p>Otro texto con alto contraste</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/1200x500/5733FF/FFFFFF?text=Imagen+3"
                    alt="Tercera imagen"
                />
                <Carousel.Caption>
                    <h3>Tercera imagen</h3>
                    <p>Imágenes con colores perceptibles para daltónicos</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
};

export default Carrusel;

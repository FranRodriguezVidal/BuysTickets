import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Eventos from "./components/pages/Eventos";
import Inicio from "./components/pages/Inicio";
import Configuracion from "./components/users/Configuracion";

function App() {
  return (
    <Router>
        <NavBar />
          <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        <Footer />
    </Router>
  );
}

export default App;

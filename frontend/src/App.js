import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Eventos from "./components/pages/Eventos";
import Inicio from "./components/pages/Inicio";
import { AuthProvider } from './components/pages/users/AuthContext'; // Importar el contexto
import Configuracion from "./components/pages/users/Configuracion";

function App() {
  return (
    // Envolver la aplicación con AuthProvider para que el contexto esté disponible globalmente
    <AuthProvider>
      <Router>
        <NavBar /> {/* El Navbar podrá acceder al estado global de autenticación */}
        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
function App() {
  return (
    <Router>
        <NavBar />
          <Routes>
          {/*<Route path="/configuracion" element={<Configuracion />} />}*/}
          </Routes>
        <Footer />
    </Router>
  );
}

export default App;

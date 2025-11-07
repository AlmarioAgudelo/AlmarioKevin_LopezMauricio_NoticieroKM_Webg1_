import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login.jsx";
import Register from "./Pages/Register/Register.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import PanelNoticias from "./components/PanelNoticias/PanelNoticias.jsx";
import PanelSecciones from "./components/PanelSecciones/PanelSecciones.jsx";
import Main from "./components/Main/Main.jsx"
import Header from "./components/Header/Header.jsx"
import Footer from "./components/Footer/Footer.jsx"
import NoticiaDetalle from "./components/NoticiaDetalle/NoticiaDetalle"; 
import "./App.css"


//
// NOMBRES DEL EQUIPO DE TRABAJO


// KEVIN ALIRIO ALMARIO AGUDELO
// MAURICIO LOPEZ JARAMILLO

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/noticia/:id" element={<NoticiaDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/panel" element={<PanelNoticias />} />
          <Route path="/panel-secciones" element={<PanelSecciones />} />
        </Routes>
        <Footer />

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

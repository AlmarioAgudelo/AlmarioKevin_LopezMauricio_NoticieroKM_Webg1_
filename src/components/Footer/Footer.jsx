import { Link } from "react-router-dom";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-title">NOTICIERO KMW</h2>
          <p className="footer-desc">
            Tu fuente confiable de noticias actuales, ciencia y tecnología.
          </p>
        </div>

        <div className="footer-links">
          <h3>Enlaces</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/login">Iniciar sesión</Link></li>
          </ul>
        </div>

        <div className="footer-social">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Noticiero KMW — Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

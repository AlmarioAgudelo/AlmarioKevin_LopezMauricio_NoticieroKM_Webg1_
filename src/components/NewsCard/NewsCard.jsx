import { Link } from "react-router-dom";
import './NewsCard.css'; // Importamos el CSS

export default function NewsCard({ id, title, image, date, description }) {
  return (
    // Contenedor principal de la tarjeta
    <div className="news-card">
      
      {/* Contenedor de la imagen que usará el fondo */}
      <div 
        className="news-card__image-container"
        style={{ backgroundImage: `url(${image})` }} // Usamos style para la URL de la imagen de fondo
      >
        {/* Contenido de texto superpuesto en la parte inferior */}
        <div className="news-card__overlay">
          
          {/* Fila superior para la fuente/fecha */}
          <div className="news-card__metadata">
            {/* El icono de la fuente (simulado con un span) */}
            <span className="news-card__source-icon">A</span> 
            <span className="news-card__date">{date}</span>
          </div>

          {/* Título de la noticia */}
          <h2 className="news-card__title">{title}</h2>
          
          {/* Sección de interacciones (Likes/Comentarios - simulado) */}
          <div className="news-card__interactions">
            <span className="news-card__like-count">👍 52</span>
            {/* Puedes agregar más interacciones aquí si es necesario */}
          </div>
        </div>
      </div>

      {/* Sección con la descripción y enlace "Leer más" (Visible al pasar el ratón o como parte inferior) */}
      {/* Este diseño hace que el título esté en la imagen, pero incluimos la descripción aquí por si se necesita */}
      <div className="news-card__body">
        <p className="news-card__description">{description}</p>
        
        <Link
          to={`/noticia/${id}`}
          className="news-card__read-more"
        >
          Leer más →
        </Link>
      </div>
    </div>
  );
}

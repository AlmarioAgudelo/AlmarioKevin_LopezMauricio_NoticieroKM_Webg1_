import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./NoticiaDetalle.css";

export default function NoticiaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const docRef = doc(db, "noticias", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNoticia(docSnap.data());
        } else {
          console.log("No se encontró la noticia");
        }
      } catch (error) {
        console.error("Error al obtener noticia:", error);
      }
    };

    fetchNoticia();
  }, [id]);

  if (!noticia) {
    return <p className="mensaje-cargando">Cargando noticia...</p>;
  }

  return (
    <div className="detalle-container">
      <div className="detalle-card">
        <h1 className="detalle-titulo">{noticia.titulo}</h1>
        <p className="detalle-subtitulo">{noticia.subtitulo}</p>

        <div className="detalle-imagen-container">
          <img
            src={noticia.imagenUrl || "https://via.placeholder.com/800x400"}
            alt={noticia.titulo}
            className="detalle-imagen"
          />
        </div>

        <div className="detalle-meta">
          <span><strong>Categoría:</strong> {noticia.categoria}</span>
          <span><strong>Autor:</strong> {noticia.autorCorreo}</span>
          <span>
            <strong>Publicado:</strong>{" "}
            {noticia.fechaCreacion?.toDate
              ? noticia.fechaCreacion.toDate().toLocaleDateString("es-CO")
              : "Fecha no disponible"}
          </span>
        </div>

        <p className="detalle-contenido">{noticia.contenido}</p>

        <button className="btn-volver" onClick={() => navigate("/")}>
          ← Volver a las noticias
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import NewsCard from "../NewsCard/NewsCard";
import NavbarCategorias from "../NavBarCat/NavBarCategorias";
import "./Main.css";

export default function Main() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    const noticiasRef = collection(db, "noticias");

    const filtros = categoria
      ? query(noticiasRef, where("estado", "==", "Publicado"), where("categoria", "==", categoria))
      : query(noticiasRef, where("estado", "==", "Publicado"));

    const unsubscribe = onSnapshot(
      filtros,
      (querySnapshot) => {
        const noticiasArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNoticias(noticiasArray);
        setLoading(false);
      },
      (error) => {
        console.error("Error en el escuchador de noticias:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [categoria]);

  return (
    <main className="main-container">

      <h1 className="titulo-principal">
        {categoria ? `Noticias de ${categoria}` : "Últimas Noticias"}
      </h1>
      <NavbarCategorias onSeleccionCategoria={(cat) => setCategoria(cat)} />

      {loading ? (
        <p className="mensaje-carga">Cargando noticias...</p>
      ) : noticias.length === 0 ? (
        <p className="mensaje-carga">No hay noticias disponibles en esta categoría.</p>
      ) : (
        <div className="news-grid">
          {noticias.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.titulo}
              image={item.imagenUrl || "https://via.placeholder.com/600x400"}
              date={item.fechaCreacion?.toDate().toLocaleDateString("es-CO") || ""}
              description={item.subtitulo}
            />
          ))}
        </div>
      )}
    </main>
  );
}

import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import CardNoticia from "../CardNotice/CardNoticia";
import PanelSecciones from "../PanelSecciones/PanelSecciones";

const PanelEditor = () => {
    const { rol } = useAuth();
    const [noticias, setNoticias] = useState([]);
    const [secciones, setSecciones] = useState([]);

    useEffect(() => {
        const fetchNoticias = async () => {
            const snapshot = await getDocs(collection(db, "noticias"));
            const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setNoticias(lista);
        };
        fetchNoticias();
    }, []);

    useEffect(() => {
        const fetchSecciones = async () => {
            const snapshot = await getDocs(collection(db, "secciones"));
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSecciones(data);
        };
        fetchSecciones();
    }, []);

    const editarNoticia = async (id, nuevaCategoriaSeleccionada) => {
        const noticiaRef = doc(db, "noticias", id);
        await updateDoc(noticiaRef, {
            categoria: nuevaCategoriaSeleccionada,
            fechaActualizacion: serverTimestamp(),
        });
        setNoticias(
            noticias.map((n) =>
                n.id === id ? { ...n, categoria: nuevaCategoriaSeleccionada } : n
            )
        );
    };

    // MODIFICACIÓN APLICADA AQUÍ ⬇️
    const cambiarEstado = async (id, nuevoEstado) => {
        const noticiaActual = noticias.find((n) => n.id === id);

        if (!noticiaActual) return;

        // Si la noticia está en "Edición", bloquea el cambio para el editor
        if (noticiaActual.estado === "Edición") {
            alert("⚠️ El editor no puede modificar el estado de una noticia en 'Edición'. El reportero debe cambiarla primero a 'Terminado'.");
            return;
        }

        // Si no está en "Edición" (es Terminado, Publicado o Desactivado), permite el cambio
        const noticiaRef = doc(db, "noticias", id);
        await updateDoc(noticiaRef, { estado: nuevoEstado, fechaActualizacion: serverTimestamp() });
        setNoticias(noticias.map((n) => (n.id === id ? { ...n, estado: nuevoEstado } : n)));
    };
    // MODIFICACIÓN APLICADA AQUÍ ⬆️

    const estados = ["Edición", "Terminado", "Publicado", "Desactivado"];
    return (

        <>
            <h3 className="titulo-noticias">Gestión de Noticias</h3>
            {estados.map((estado) => (
                <div key={estado} className="bloque-estado">
                    <h4 className="estado-titulo">{estado}</h4>
                    <div className="grid-noticias">
                        {noticias
                            .filter((n) => n.estado === estado)
                            .map((n) => {
                                console.log("🔍 noticia en render:", n); // ⬅️ ponlo AQUÍ
                                return (
                                    <CardNoticia
                                        key={n.id}
                                        noticia={n}
                                        secciones={secciones}
                                        rol={rol}
                                        editarNoticia={editarNoticia}
                                        cambiarEstado={cambiarEstado}
                                    />
                                    
                                );
                                
                            })}
                            
                    </div>
                </div>
            ))}
            <PanelSecciones />
        </>
    );
};

export default PanelEditor;
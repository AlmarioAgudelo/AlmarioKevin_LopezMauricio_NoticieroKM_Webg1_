import { useState, useEffect, useCallback } from "react";
import { db, auth } from "../../firebaseConfig";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import CardNoticia from "../CardNotice/CardNoticia";

const PanelReportero = () => {
    const { user, rol } = useAuth();
    const [noticias, setNoticias] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [categoria, setCategoria] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // fetchSecciones (sin cambios significativos)
    useEffect(() => {
        const fetchSecciones = async () => {
            try {
                const snapshot = await getDocs(collection(db, "secciones"));
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setSecciones(data);
            } catch (err) {
                console.error("Error fetch secciones:", err);
            }
        };
        fetchSecciones();
    }, []);

    // fetchNoticias extraída y reutilizable
    const fetchNoticias = useCallback(async () => {
        if (!user) return;
        try {
            let snapshot;
            if (rol === "editor") {
                // editor: trae todas las noticias
                snapshot = await getDocs(collection(db, "noticias"));
            } else {
                // reportero: solo las suyas
                const q = query(collection(db, "noticias"), where("autor", "==", user.uid));
                snapshot = await getDocs(q);
            }
            const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setNoticias(lista);
            console.log("Noticias cargadas:", lista.length);
        } catch (err) {
            console.error("Error fetch noticias:", err);
        }
    }, [user, rol]);

    // Llamar fetchNoticias cuando cambien user o rol
    useEffect(() => {
        fetchNoticias();
    }, [fetchNoticias]);

    const handleCrearNoticia = async (e) => {
        e.preventDefault();
        if (!titulo || !contenido) return alert("Debes llenar título y contenido");

        setIsSubmitting(true);
        try {
            const docRef = await addDoc(collection(db, "noticias"), {
                titulo,
                subtitulo,
                contenido,
                categoria,
                imagenUrl,
                autor: user.uid,
                autorCorreo: user.email,
                fechaCreacion: serverTimestamp(),
                fechaActualizacion: serverTimestamp(),
                estado: "Edición",
            });

            // opcional: no confiar en serverTimestamp para UI inmediata, agregamos con new Date()
            setNoticias((prev) => [
                ...prev,
                {
                    id: docRef.id,
                    titulo,
                    subtitulo,
                    contenido,
                    categoria,
                    imagenUrl,
                    autor: user.uid,
                    autorCorreo: user.email,
                    fechaCreacion: new Date(),
                    fechaActualizacion: new Date(),
                    estado: "Edición",
                },
            ]);

            setTitulo("");
            setSubtitulo("");
            setContenido("");
            setCategoria("");
            setImagenUrl("");
            alert("Noticia creada exitosamente");
        } catch (err) {
            console.error("Error creando noticia:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // cambiarEstado: mantiene la validación actual para reporteros,
    // pero si rol === "editor" permitimos cualquier cambio (o ajustar según reglas)
    const cambiarEstado = async (id, nuevoEstado) => {
        const noticia = noticias.find((n) => n.id === id);
        if (!noticia) return;

        const estadoActual = noticia.estado;

        if (rol !== "editor") {
            const esValido =
                (estadoActual === "Edición" && nuevoEstado === "Terminado") ||
                (estadoActual === "Terminado" && nuevoEstado === "Edición");

            if (!esValido) {
                alert("Solo puedes cambiar entre 'Edición' y 'Terminado'.");
                return;
            }
        }

        try {
            const noticiaRef = doc(db, "noticias", id);
            await updateDoc(noticiaRef, { estado: nuevoEstado, fechaActualizacion: serverTimestamp() });
            // actualizar local
            setNoticias((prev) => prev.map((n) => (n.id === id ? { ...n, estado: nuevoEstado } : n)));
        } catch (err) {
            console.error("Error cambiando estado:", err);
        }
    };

    // editarNoticia soporta dos casos:
    // 1) editarNoticia(id) -> prompts para editar título/subtitulo/contenido/imagen
    // 2) editarNoticia(id, nuevaCategoria) -> solo actualiza la categoría (desde el select en Card)
    const editarNoticia = async (id, nuevaCategoria = null) => {
        const noticia = noticias.find((n) => n.id === id);
        if (!noticia) return;

        try {
            const noticiaRef = doc(db, "noticias", id);

            if (nuevaCategoria !== null) {
                // caso: cambio de categoría desde el select
                await updateDoc(noticiaRef, { categoria: nuevaCategoria, fechaActualizacion: serverTimestamp() });
                setNoticias((prev) => prev.map((n) => (n.id === id ? { ...n, categoria: nuevaCategoria } : n)));
                return;
            }

            // caso: edición completa vía prompts
            const nuevoTitulo = prompt("Nuevo título:", noticia.titulo);
            const nuevoSubtitulo = prompt("Nuevo subtítulo:", noticia.subtitulo);
            const nuevoContenido = prompt("Nuevo contenido:", noticia.contenido);
            const nuevaImagenUrl = prompt("Nueva URL de imagen:", noticia.imagenUrl);

            if (!nuevoTitulo || !nuevoSubtitulo || !nuevoContenido) {
                alert("Todos los campos son obligatorios");
                return;
            }

            await updateDoc(noticiaRef, {
                titulo: nuevoTitulo,
                subtitulo: nuevoSubtitulo,
                contenido: nuevoContenido,
                imagenUrl: nuevaImagenUrl,
                fechaActualizacion: serverTimestamp(),
            });

            // refrescar lista para asegurar datos consistentes
            await fetchNoticias();

            alert("✅ Noticia editada correctamente");
        } catch (err) {
            console.error("Error editando noticia:", err);
            alert("Ocurrió un error al editar la noticia.");
        }
    };

    const estados = ["Edición", "Terminado", "Publicado", "Desactivado"];

    return (
        <>
            <div className="crear-noticia">
                <h3>Crear Nueva Noticia</h3>
                <form onSubmit={handleCrearNoticia}>
                    <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                    <input type="text" placeholder="Subtítulo" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />
                    <textarea placeholder="Contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} />
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        <option value="">Selecciona una categoría</option>
                        {secciones.map((sec) => (
                            <option key={sec.id} value={sec.nombre}>
                                {sec.nombre}
                            </option>
                        ))}
                    </select>
                    <input type="text" placeholder="URL de la imagen" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creando..." : "Crear Noticia"}
                    </button>
                </form>
            </div>

            <h3 className="titulo-noticias">Mis Noticias</h3>
            {estados.map((estado) => (
                <div key={estado} className="bloque-estado">
                    <h4 className="estado-titulo">{estado}</h4>
                    <div className="grid-noticias">
                        {noticias
                            .filter((n) => n.estado === estado)
                            .map((n) => (
                                <CardNoticia
                                    key={n.id}
                                    noticia={n}
                                    secciones={secciones}
                                    rol={rol}
                                    editarNoticia={editarNoticia}
                                    cambiarEstado={cambiarEstado}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </>
    );
};

export default PanelReportero;

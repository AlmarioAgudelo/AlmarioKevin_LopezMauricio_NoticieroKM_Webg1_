import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import "./PanelSecciones.css";

const PanelSecciones = () => {
    const [secciones, setSecciones] = useState([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [editando, setEditando] = useState(null);
    const [visibleCount, setVisibleCount] = useState(8); // Cuántas secciones mostrar inicialmente

    useEffect(() => {
        const fetchSecciones = async () => {
            const snapshot = await getDocs(collection(db, "secciones"));
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSecciones(data);
        };
        fetchSecciones();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return alert("El nombre es obligatorio");

        if (editando) {
            const ref = doc(db, "secciones", editando);
            await updateDoc(ref, {
                nombre,
                descripcion,
                fechaActualizacion: serverTimestamp(),
            });
            setSecciones(
                secciones.map((s) =>
                    s.id === editando ? { ...s, nombre, descripcion } : s
                )
            );
            setEditando(null);
        } else {
            const docRef = await addDoc(collection(db, "secciones"), {
                nombre,
                descripcion,
                fechaCreacion: serverTimestamp(),
            });
            setSecciones([...secciones, { id: docRef.id, nombre, descripcion }]);
        }

        setNombre("");
        setDescripcion("");
    };

    const eliminarSeccion = async (id) => {
        if (confirm("¿Eliminar esta sección?")) {
            await deleteDoc(doc(db, "secciones", id));
            setSecciones(secciones.filter((s) => s.id !== id));
        }
    };

    const editarSeccion = (sec) => {
        setEditando(sec.id);
        setNombre(sec.nombre);
        setDescripcion(sec.descripcion);
    };

    const mostrarMas = () => setVisibleCount((prev) => prev + 6);
    const mostrarMenos = () => setVisibleCount((prev) => Math.max(6, prev - 6));

    return (
        <div className="panel-secciones">
            <div className="panel-secciones-left">
                <h2>Gestión de Secciones</h2>
                <form onSubmit={handleSubmit} className="form-seccion">
                    <input
                        type="text"
                        placeholder="Nombre de la sección"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <textarea
                        placeholder="Descripción (opcional)"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                    <button type="submit">
                        {editando ? "Actualizar" : "Crear"} Sección
                    </button>
                </form>
            </div>

            <div className="panel-secciones-right">
                <ul className="lista-secciones">
                    {secciones.slice(0, visibleCount).map((s) => (
                        <li key={s.id}>
                            <strong>{s.nombre}</strong>
                            <p>{s.descripcion}</p>
                            <div className="acciones-seccion">
                                <button className="btn-editar" onClick={() => editarSeccion(s)}>Editar</button>
                                <button className="btn-eliminar" onClick={() => eliminarSeccion(s.id)}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="botones-scroll">
                    {secciones.length > 8 && visibleCount < secciones.length && (
                        <button onClick={mostrarMas}>Mostrar más</button>
                    )}
                    {secciones.length > 8 && visibleCount > 8 && (
                        <button onClick={mostrarMenos}>Mostrar menos</button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default PanelSecciones;

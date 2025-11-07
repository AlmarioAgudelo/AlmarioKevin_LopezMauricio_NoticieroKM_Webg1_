import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./NavBarCategorias.css";

const NavbarCategorias = ({ onSeleccionCategoria }) => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const snapshot = await getDocs(collection(db, "secciones"));
                const lista = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCategorias(lista);
            } catch (err) {
                console.error("Error cargando categorías:", err);
            }
        };

        fetchCategorias();
    }, []);

    return (
        <nav className="navbar-categorias">
            <div className="navbar-botones">
                <button onClick={() => onSeleccionCategoria(null)} className="btn-todas">
                    Todas
                </button>
                {categorias.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSeleccionCategoria(cat.nombre)}
                        className="btn-categoria"
                    >
                        {cat.nombre}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default NavbarCategorias;

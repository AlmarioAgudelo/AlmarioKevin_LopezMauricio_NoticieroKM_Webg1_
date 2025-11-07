// src/Context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // <- IMPORTA db desde firebaseConfig

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [rol, setRol] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userFirebase) => {
            try {
                if (userFirebase) {
                    const ref = doc(db, "usuarios", userFirebase.uid);
                    const snap = await getDoc(ref);
                    if (snap.exists()) {
                        setUser(userFirebase);
                        setRol(snap.data().rol);
                    } else {
                        setUser(userFirebase);
                        setRol(null);
                    }
                } else {
                    setUser(null);
                    setRol(null);
                }
            } catch (err) {
                console.error("AuthContext - error leyendo rol:", err);
                setUser(userFirebase || null);
                setRol(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, rol, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

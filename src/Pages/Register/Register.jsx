import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Register = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && user) {
            navigate("/panel");
        }
    }, [user, loading, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "usuarios", user.uid), {
                correo: email,
                rol: "reportero",
            });

            console.log("Usuario registrado:", user.email);
        } catch (err) {
            console.error("Error en registro:", err);
            if (err.code === "auth/invalid-email") {
                setError("Correo no válido");
            } else if (err.code === "auth/weak-password") {
                setError("La contraseña debe tener al menos 6 caracteres");
            } else if (err.code === "auth/email-already-in-use") {
                setError("El correo ya está registrado");
            } else {
                setError("Error al registrar");
            }
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h2>Crear cuenta</h2>
                <p className="subtitle">Únete a nuestra comunidad de reporteros</p>
                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Registrarse</button>
                    {error && <p className="error">{error}</p>}
                </form>
                <p className="login-link">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

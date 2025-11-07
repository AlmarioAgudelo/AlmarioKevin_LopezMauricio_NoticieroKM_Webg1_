import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Register = () => {
    const { user, rol, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // ← nuevo estado

    useEffect(() => {
        if (!loading && user) navigate("/panel");
    }, [user, loading]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true); // ← inicio carga
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "usuarios", userCredential.user.uid), {
                email: email,
                rol: "reportero"
            });
            // Redirección se maneja en useEffect
        } catch (err) {
            console.error("Error al registrar:", err);
            if (err.code === "auth/email-already-in-use") setError("Correo ya registrado");
            else if (err.code === "auth/invalid-email") setError("Correo no válido");
            else if (err.code === "auth/weak-password") setError("Contraseña débil");
            else setError("Error al registrar");
        }
        setIsLoading(false); // ← fin carga
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <h1>¡Crea tu cuenta!</h1>
                    <p>Regístrate para empezar a usar Noticiero KMW</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-register" disabled={isLoading}>
                        {isLoading ? <span className="spinner"></span> : "Registrarse"}
                    </button>

                    {error && <p className="error-message">{error}</p>}
                </form>

                <p className="login-text">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

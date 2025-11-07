import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
    const { user, rol, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // ← nuevo estado

    useEffect(() => {
        if (!loading && user) navigate("/panel");
    }, [user, loading]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true); // ← inicio carga
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirección se maneja en useEffect
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            if (err.code === "auth/invalid-email") setError("Correo no válido");
            else if (err.code === "auth/user-not-found") setError("Usuario no encontrado");
            else if (err.code === "auth/wrong-password") setError("Contraseña incorrecta");
            else setError("Error al iniciar sesión");
        }
        setIsLoading(false); // ← fin carga
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>Bienvenido 👋</h1>
                    <p>Inicia sesión para continuar</p>
                </div>

                <form onSubmit={handleLogin}>
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

                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? <span className="spinner"></span> : "Entrar"}
                    </button>

                    {error && <p className="error-message">{error}</p>}
                </form>

                <p className="register-text">
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

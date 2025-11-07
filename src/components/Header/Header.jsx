import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../Context/AuthContext";
import "./Header.css";

function Header() {
	const { user, loading, rol } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await signOut(auth);
		navigate("/login");
	};

	if (loading) return null;

	return (
		<header className="site-header" role="banner" aria-label="Encabezado principal">
			<div className="header-container">
				<h1 className="site-title">
					<Link to="/" className="home-link">NOTICIERO KMW</Link>
				</h1>
				<nav className="header-nav">
					{user ? (
						<>
							<span className="user-email">
								{rol === "reportero" ? "Reportero" : "Editor"} {user.email}
							</span>


							<Link to="/panel" className="manage-btn">
								Gestionar
							</Link>
							<button className="logout-btn" onClick={handleLogout}>
								Cerrar sesión
							</button>
						</>
					) : (
						<Link to="/login" className="login-btn">Iniciar sesión</Link>
					)}
				</nav>
			</div>
		</header>
	);
}

export default Header;

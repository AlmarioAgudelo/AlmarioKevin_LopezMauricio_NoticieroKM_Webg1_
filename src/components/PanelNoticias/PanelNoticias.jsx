import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PanelReportero from "./PanelReportero";
import PanelEditor from "./PanelEditor";
import "../PanelNoticias/PanelNoticias.css";

const PanelNoticias = () => {
    const { user, rol, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) navigate("/login");
    }, [user, loading]);

    if (loading) return <p>Cargando...</p>;
    if (!user) return null;

    return (
        <div className="panel-container">
            {rol === "reportero" && <PanelReportero />}
            {rol === "editor" && <PanelEditor />}
        </div>
    );
};

export default PanelNoticias;

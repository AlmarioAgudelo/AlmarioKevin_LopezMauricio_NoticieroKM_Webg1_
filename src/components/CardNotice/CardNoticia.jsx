import "./CardNoticia.css";

const CardNoticia = ({ noticia, secciones, rol, editarNoticia, cambiarEstado }) => {
    return (
        <div className="card-noticia">
            {noticia.imagenUrl && (
                    <img
                    src={noticia.imagenUrl}
                    alt={noticia.titulo}
                    className="card-noticia-img"
                />
            )}

            <div className="card-noticia-content">
                <div className="card-noticia-header">
                    <span className="tag categoria">{noticia.categoria}</span>
                    <span
                        className={`tag estado ${noticia.estado === "Publicado"
                            ? "publicado"
                            : noticia.estado === "Terminado"
                                ? "terminado"
                                : "borrador"
                            }`}
                    >
                        {noticia.estado}
                    </span>
                </div>

                <h2 className="card-titulo">{noticia.titulo}</h2>
                <h4 className="card-subtitulo">{noticia.subtitulo}</h4>
                <p className="card-contenido">{noticia.contenido}</p>

                <div className="card-footer">
                    <p>
                        Por: <strong>{noticia.autorCorreo}</strong> | Creado:{" "}
                        {noticia.fechaCreacion?.seconds
                            ? new Date(noticia.fechaCreacion.seconds * 1000).toLocaleString()
                            : "Pendiente..."}
                    </p>

                    {(rol === "editor" || (rol === "reportero" && !["Publicado", "Desactivado"].includes(noticia.estado))) && (
                        <div className="card-controles">
                            <label>
                                Estado:
                                <select
                                    value={noticia.estado}
                                    onChange={(e) => {
                                        const nuevoEstado = e.target.value;

                                        if (rol === "reportero") {
                                            if (
                                                (noticia.estado === "Edición" && nuevoEstado === "Terminado") ||
                                                (noticia.estado === "Terminado" && nuevoEstado === "Edición")
                                            ) {
                                                cambiarEstado(noticia.id, nuevoEstado);
                                            } else {
                                                alert("Solo puedes cambiar entre 'Edición' y 'Terminado'.");
                                            }
                                        } else {
                                            cambiarEstado(noticia.id, nuevoEstado);
                                        }
                                    }}
                                >
                                    {rol === "reportero" ? (
                                        <>
                                            <option>Edición</option>
                                            <option>Terminado</option>
                                        </>
                                    ) : (
                                        <>
                                            <option>Edición</option>
                                            <option>Terminado</option>
                                            <option>Publicado</option>
                                            <option>Desactivado</option>
                                        </>
                                    )}
                                </select>
                            </label>

                            {rol === "editor" && (
                                <label>
                                    Categoría:
                                    <select
                                        value={noticia.categoria}
                                        onChange={(e) =>
                                            editarNoticia(noticia.id, e.target.value)
                                        }
                                    >
                                        {secciones.map((s) => (
                                            <option key={s.id} value={s.nombre}>
                                                {s.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}
                        </div>
                    )}


                </div>
            </div>
            {rol === "reportero" && (
                <button onClick={() => editarNoticia(noticia.id)} className="boton-editar">
                    Editar
                </button>
            )}
            

        </div>
    );
};

export default CardNoticia;
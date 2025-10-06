import { getSeverity, badgeClass, sevLabel } from "../utils/helpers";

export default function Analysis({ result }) {
    return (
        <>
            <h1 className="page-title">AI Analysis</h1>
            <div className="card">
                {!result ? (
                    <div className="muted">
                        Ejecutá un test desde el Dashboard para ver resultados.
                    </div>
                ) : (
                    <>
                        <div className="analysis-head">
                            <div className="pill-row">
                                <span className={badgeClass(getSeverity(result))}>
                                    {sevLabel(getSeverity(result))}
                                </span>
                            </div>
                            {"queVeo" in result && (
                                <p className="muted">
                                    <strong>Resumen:</strong> {String(result.queVeo)}
                                </p>
                            )}
                        </div>

                        {Array.isArray(result.hallazgos) ? (
                            <ul className="findings">
                                {result.hallazgos.map((h, i) => (
                                    <li key={i} className="finding">
                                        <div className="finding-row">
                                            <span className="tag sm">{h.categoria || "General"}</span>
                                            <span
                                                className={`tag sm ${String(h.criticidad || "")
                                                    .toLowerCase()
                                                    .replace("ó", "o")}`}
                                            >
                                                {h.criticidad || "—"}
                                            </span>
                                        </div>
                                        <div className="finding-title">{h.titulo || "Hallazgo"}</div>
                                        <div className="finding-desc">{h.descripcion}</div>
                                        {h.selector && <div className="code">{h.selector}</div>}
                                    </li>
                                ))}
                            </ul>
                        ) : Array.isArray(result.modificaciones) &&
                          result.modificaciones.length > 0 ? (
                            <>
                                <h3>Modificaciones sugeridas</h3>
                                <ul className="list">
                                    {result.modificaciones.map((m, i) => (
                                        <li key={i}>{m}</li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="muted">Sin hallazgos.</div>
                        )}

                        <details className="raw">
                            <summary>Ver JSON crudo</summary>
                            <pre className="code">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </details>
                        <img
                            className="screenshot"
                            src={`http://localhost:5288/assets/screenshots/${result.id}.png`}
                            alt="Website Screenshot"
                        />
                    </>
                )}
            </div>
        </>
    );
}
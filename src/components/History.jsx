import { formatDuration, badgeClass, sevLabel } from "../utils/helpers";

export default function History({ history, onViewResult, onTabChange }) {
    return (
        <>
            <h1 className="page-title">Test History</h1>
            <div className="card">
                {history.length === 0 ? (
                    <div className="muted">No hay tests registrados.</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>URL</th>
                                    <th>Status</th>
                                    <th>Findings</th>
                                    <th>Criticality</th>
                                    <th>Date</th>
                                    <th>Duration</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h) => (
                                    <tr key={h.id}>
                                        <td className="ellipsis">
                                            <a href={h.Url} target="_blank" rel="noreferrer">
                                                {h.Url}
                                            </a>
                                        </td>
                                        <td>
                                            <span className={badgeClass(h.severity)}>
                                                {sevLabel(h.severity)}
                                            </span>
                                        </td>
                                        <td>{h.total}</td>
                                        <td>
                                            A {h.counts.alto} · M {h.counts.medio} · B {h.counts.bajo}
                                        </td>
                                        <td>{new Date(h.fecha).toLocaleString()}</td>
                                        <td>{formatDuration(h.durationMs)}</td>
                                        <td>
                                            <button
                                                className="btn ghost"
                                                onClick={() => {
                                                    onViewResult(h.raw);
                                                    onTabChange("analysis");
                                                }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
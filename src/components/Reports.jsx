import { exportHistoryCSV } from "../utils/helpers";

export default function Reports({ history }) {
    return (
        <>
            <h1 className="page-title">Reports</h1>
            <div className="card">
                <p className="muted">
                    Exportá el historial en CSV para compartir con el equipo.
                </p>
                <button
                    className="btn primary"
                    onClick={() => exportHistoryCSV(history)}
                    disabled={history.length === 0}
                >
                    Export CSV
                </button>
            </div>
        </>
    );
}
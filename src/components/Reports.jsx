import { exportHistoryCSV } from "../utils/helpers";
import { t } from "../i18n";

export default function Reports({ history }) {
    return (
        <>
            <h1 className="page-title">{t('reports.title')}</h1>
            <div className="card">
                <p className="muted">{t('reports.exportHint')}</p>
                <button
                    className="btn primary"
                    onClick={() => exportHistoryCSV(history)}
                    disabled={history.length === 0}
                >
                    {t('reports.exportButton')}
                </button>
            </div>
        </>
    );
}
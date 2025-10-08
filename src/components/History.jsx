import { formatDuration, badgeClass, sevLabel } from "../utils/helpers";
import { t } from "../i18n";

export default function History({ history, onViewResult, onTabChange }) {
    return (
        <>
            <h1 className="page-title">{t('history.title')}</h1>
            <div className="card">
                {history.length === 0 ? (
                    <div className="muted">{t('history.noTests')}</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('history.headers.url')}</th>
                                    <th>{t('history.headers.status')}</th>
                                    <th>{t('history.headers.findings')}</th>
                                    <th>{t('history.headers.criticality')}</th>
                                    <th>{t('history.headers.date')}</th>
                                    <th>{t('history.headers.duration')}</th>
                                    <th>{t('history.headers.action')}</th>
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
                                                {t('common.view')}
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
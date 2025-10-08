import { useMemo } from "react";
import { formatDuration, badgeClass, sevLabel, countCriticalities, getSeverity } from "../utils/helpers";
import { API_URL } from "../utils/constants";
import { t } from "../i18n";

export default function Dashboard({ 
    history, 
    onResultSet, 
    onTabChange,
    Url,
    setUrl,
    Tolerance,
    setTolerance,
    Language,
    setLanguage,
    loading,
    setLoading,
    error,
    setError,
    setResult,
    setHistory
}) {
    // KPIs del dashboard (derivados del historial)
    const kpi = useMemo(() => {
        if (history.length === 0)
            return { total: 0, successRate: 0, critical: 0, avgMs: 0 };
        const total = history.length;
        const ok = history.filter((h) => h.severity === "ok").length;
        const successRate = Math.round((ok / total) * 100);
        const critical = history.reduce((acc, h) => acc + (h.counts?.alto || 0), 0);
        const avgMs = Math.round(
            history.reduce((acc, h) => acc + (h.durationMs || 0), 0) / total
        );
        return { total, successRate, critical, avgMs };
    }, [history]);

    async function runAnalysis(e) {
        e?.preventDefault?.();
        setError("");
        setResult(null);

        if (!/^https?:\/\//i.test(Url)) {
            setError(t('form.urlError'));
            return;
        }

        const started = performance.now();
        setLoading(true);
        try {
            const payload = { Url, Tolerance, Language };
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const body = await res.json();
            if (!res.ok) throw new Error(body.error || "Error en análisis");

            setResult(body);
            onTabChange("analysis");

            const elapsed = performance.now() - started;
            const { counts, total } = countCriticalities(body);
            const severity = getSeverity(body);

            const entry = {
                id: Date.now(),
                Url,
                fecha: new Date().toISOString(),
                Tolerance,
                Language,
                durationMs: Math.round(elapsed),
                counts,
                total,
                severity,
                raw: body,
            };
            setHistory((h) => [entry, ...h].slice(0, 20));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="page-title">{t('dashboard.title')}</h1>

            <section className="cards">
                <div className="card kpi">
                    <div className="kpi-title">{t('dashboard.totalTests')}</div>
                    <div className="kpi-num">{kpi.total}</div>
                </div>
                <div className="card kpi">
                    <div className="kpi-title">{t('dashboard.successRate')}</div>
                    <div className="kpi-num">{kpi.successRate}%</div>
                </div>
                <div className="card kpi">
                    <div className="kpi-title">{t('dashboard.criticalIssues')}</div>
                    <div className="kpi-num">{kpi.critical}</div>
                </div>
                <div className="card kpi">
                    <div className="kpi-title">{t('dashboard.avgExecution')}</div>
                    <div className="kpi-num">{formatDuration(kpi.avgMs)}</div>
                </div>
            </section>

            <section className="grid">
                {/* Últimas ejecuciones */}
                <div className="card">
                    <div className="card-head">
                        <div className="card-title">{t('dashboard.recentTitle')}</div>
                    </div>
                        {history.length === 0 ? (
                            <div className="muted">{t('dashboard.noExecutions')}</div>
                        ) : (
                        <ul className="runs">
                            {history.slice(0, 5).map((h) => (
                                <li key={h.id} className="run">
                                    <div className="run-url">
                                        <a href={h.Url} target="_blank" rel="noreferrer">
                                            {h.Url}
                                        </a>
                                    </div>
                                    <div className="run-meta">
                                        {new Date(h.fecha).toLocaleString()} · {h.total} {t('history.headers.findings')} ·{" "}
                                        <span className={badgeClass(h.severity)}>
                                            {sevLabel(h.severity)}
                                        </span>{" "}
                                        · {formatDuration(h.durationMs)}
                                    </div>
                                    <div className="run-actions">
                                        <button
                                            className="btn ghost"
                                            onClick={() => {
                                                setResult(h.raw);
                                                onTabChange("analysis");
                                            }}
                                        >
                                            {t('common.view')}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Configuración + Run */}
                <div className="card">
                    <div className="card-head">
                        <div className="card-title">{t('dashboard.configTitle')}</div>
                    </div>

                    <form className="form" onSubmit={runAnalysis}>
                        <label className="field">
                            <span>{t('dashboard.websiteUrl')}</span>
                            <input
                                className="input"
                                type="url"
                                placeholder="https://example.com"
                                value={Url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </label>

                        <div className="row">
                            <label className="field">
                                            <span>{t('dashboard.tolerance')}</span>
                                <select
                                    className="select"
                                    value={Tolerance}
                                    onChange={(e) => setTolerance(e.target.value)}
                                >
                                    <option value="High">{t('dashboard.toleranceHigh')}</option>
                                    <option value="Medium">{t('dashboard.toleranceMedium')}</option>
                                    <option value="Low">{t('dashboard.toleranceLow')}</option>
                                </select>
                            </label>
                            <label className="field">
                                            <span>{t('dashboard.language')}</span>
                                <select
                                    className="select"
                                    value={Language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="es">{t('dashboard.lang_es')}</option>
                                    <option value="en">{t('dashboard.lang_en')}</option>
                                    <option value="it">{t('dashboard.lang_it')}</option>
                                </select>
                            </label>

                            <div className="grow" />
                            <button className="btn primary" disabled={loading}>
                                {loading ? t('dashboard.running') : t('dashboard.runButton')}
                            </button>
                        </div>

                        {error && <div className="error">{error}</div>}
                    </form>
                </div>
            </section>
        </>
    );
}
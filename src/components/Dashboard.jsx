import { useMemo } from "react";
import { formatDuration, badgeClass, sevLabel, countCriticalities, getSeverity } from "../utils/helpers";
import { API_URL } from "../utils/constants";

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
            setError("Ingresá una URL con http(s)://");
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
            <h1 className="page-title">QA Testing Dashboard</h1>

            <section className="cards">
                <div className="card kpi">
                    <div className="kpi-title">Total Tests</div>
                    <div className="kpi-num">{kpi.total}</div>
                </div>
                <div className="card kpi">
                    <div className="kpi-title">Success Rate</div>
                    <div className="kpi-num">{kpi.successRate}%</div>
                </div>
                <div className="card kpi">
                    <div className="kpi-title">Critical Issues</div>
                    <div className="kpi-num">{kpi.critical}</div>
                </div>
                <div className="card kpi">
                    <div className="kpi-title">Avg. Execution</div>
                    <div className="kpi-num">{formatDuration(kpi.avgMs)}</div>
                </div>
            </section>

            <section className="grid">
                {/* Últimas ejecuciones */}
                <div className="card">
                    <div className="card-head">
                        <div className="card-title">Recent Test Executions</div>
                    </div>
                    {history.length === 0 ? (
                        <div className="muted">Aún no hay ejecuciones.</div>
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
                                        {new Date(h.fecha).toLocaleString()} · {h.total} findings ·{" "}
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
                                            View
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
                        <div className="card-title">Test Configuration</div>
                    </div>

                    <form className="form" onSubmit={runAnalysis}>
                        <label className="field">
                            <span>Website URL</span>
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
                                <span>Tolerance</span>
                                <select
                                    className="select"
                                    value={Tolerance}
                                    onChange={(e) => setTolerance(e.target.value)}
                                >
                                    <option value="High">Alta</option>
                                    <option value="Medium">Media</option>
                                    <option value="Low">Baja</option>
                                </select>
                            </label>
                            <label className="field">
                                <span>Language</span>
                                <select
                                    className="select"
                                    value={Language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="es">Español</option>
                                    <option value="en">English</option>
                                    <option value="it">Italiano</option>
                                </select>
                            </label>

                            <div className="grow" />
                            <button className="btn primary" disabled={loading}>
                                {loading ? "Running…" : "Run Test"}
                            </button>
                        </div>

                        {error && <div className="error">{error}</div>}
                    </form>
                </div>
            </section>
        </>
    );
}
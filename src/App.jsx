import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5288/api/Analysis";

const CATEGORIES = [
    { key: "ui", label: "UI/Styles" },
    { key: "forms", label: "Forms" },
    { key: "links", label: "Links" },
    { key: "images", label: "Images" },
    { key: "text", label: "Text" },
    { key: "responsive", label: "Responsiveness" },
];

const TABS = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "history", label: "Test History", icon: "🕘" },
    { key: "reports", label: "Reports", icon: "📄" },
    { key: "analysis", label: "AI Analysis", icon: "💡" },
    { key: "settings", label: "Settings", icon: "⚙️" },
];

function formatDuration(ms) {
    const s = Math.max(1, Math.round(ms / 1000));
    return `${s}s`;
}

function countCriticalities(data) {
    const counts = { alto: 0, medio: 0, bajo: 0 };
    if (Array.isArray(data?.hallazgos)) {
        for (const h of data.hallazgos) {
            const k = String(h?.criticidad || "").toLowerCase();
            if (k in counts) counts[k] += 1;
        }
        return { counts, total: data.hallazgos.length };
    }
    if (Array.isArray(data?.modificaciones)) {
        return { counts, total: data.modificaciones.length };
    }
    return { counts, total: 0 };
}

function getSeverity(data) {
    const { counts } = countCriticalities(data);
    if (counts.alto > 0 || data?.necesitaModificacion) return "high";
    if (counts.medio > 0) return "medium";
    return "ok";
}

export default function App() {
    // Nav + configuración
    const [tab, setTab] = useState("dashboard");
    const [Url, setUrl] = useState("");
    const [Tolerance, setTolerance] = useState("medium");
    const [Language, setLanguage] = useState("es");
    const [cats, setCats] = useState(() =>
        Object.fromEntries(CATEGORIES.map((c) => [c.key, true]))
    );

    // Estado ejecución
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    // Historial (persistencia local)
    const [history, setHistory] = useState(() => {
        const raw = localStorage.getItem("qaHistoryV1");
        return raw ? JSON.parse(raw) : [];
    });

    useEffect(() => {
        localStorage.setItem("qaHistoryV1", JSON.stringify(history));
    }, [history]);

    const selectedCats = useMemo(
        () => CATEGORIES.filter((c) => cats[c.key]).map((c) => c.label),
        [cats]
    );

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
            const payload = { Url, Tolerance, Language, categorias: selectedCats };
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const body = await res.json();
            if (!res.ok) throw new Error(body.error || "Error en análisis");

            setResult(body);
            setTab("analysis");

            const elapsed = performance.now() - started;
            const { counts, total } = countCriticalities(body);
            const severity = getSeverity(body);

            const entry = {
                id: Date.now(),
                Url,
                fecha: new Date().toISOString(),
                Tolerance,
                Language,
                categorias: selectedCats,
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

    // Helpers UI
    function toggleCat(key) {
        setCats((p) => ({ ...p, [key]: !p[key] }));
    }
    function badgeClass(sev) {
        return `pill ${sev}`;
    }
    function sevLabel(sev) {
        return sev === "high" ? "High" : sev === "medium" ? "Medium" : "OK";
    }

    // Exportar CSV del historial
    function exportHistoryCSV() {
        if (history.length === 0) return;
        const rows = [
            [
                "date",
                "Url",
                "Tolerance",
                "Language",
                "categories",
                "duration",
                "severity",
                "A",
                "M",
                "B",
                "total",
            ],
        ];
        history.forEach((h) =>
            rows.push([
                h.fecha,
                h.Url,
                h.Tolerance,
                h.Language,
                h.categorias.join("|"),
                formatDuration(h.durationMs),
                h.severity,
                h.counts.alto,
                h.counts.medio,
                h.counts.bajo,
                h.total,
            ])
        );
        const csv = rows.map((r) => r.join(",")).join("\r\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `qa-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    return (
        <div className="shell">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="brand-row">
                    <div className="logo-circle">AI</div>
                    <div className="brand-txt">QA Dashboard</div>
                </div>

                <nav className="nav">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            className={`nav-item ${tab === t.key ? "active" : ""}`}
                            onClick={() => setTab(t.key)}
                            title={t.label}
                        >
                            <span className="nav-ico">{t.icon}</span>
                            <span>{t.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-foot">
                    <div className="muted">Proyecto colaborativo</div>
                </div>
            </aside>

            {/* Contenido */}
            <main className="content">
                <header className="topbar">
                    <input
                        className="search"
                        placeholder="Search tests, URLs, or findings…"
                    />
                    <div className="user-chip">TU</div>
                </header>

                {/* ===== Dashboard ===== */}
                {tab === "dashboard" && (
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
                                                            setTab("analysis");
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

                                    <div className="field">
                                        <span>Test Categoriess</span>
                                        <div className="chips">
                                            {CATEGORIES.map((c) => (
                                                <label key={c.key} className="chip">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!cats[c.key]}
                                                        onChange={() => toggleCat(c.key)}
                                                    />
                                                    {c.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

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
                                                value={Tolerance}
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
                )}

                {/* ===== Historial ===== */}
                {tab === "history" && (
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
                                                                setResult(h.raw);
                                                                setTab("analysis");
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
                )}

                {/* ===== Reports ===== */}
                {tab === "reports" && (
                    <>
                        <h1 className="page-title">Reports</h1>
                        <div className="card">
                            <p className="muted">
                                Exportá el historial en CSV para compartir con el equipo.
                            </p>
                            <button
                                className="btn primary"
                                onClick={exportHistoryCSV}
                                disabled={history.length === 0}
                            >
                                Export CSV
                            </button>
                        </div>
                    </>
                )}

                {/* ===== AI Analysis ===== */}
                {tab === "analysis" && (
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
                )}

                {/* ===== Settings ===== */}
                {tab === "settings" && (
                    <>
                        <h1 className="page-title">Settings</h1>
                        <div className="card">
                            <p className="muted">
                                (Placeholder) Configuraciones generales del panel.
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

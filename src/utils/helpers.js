export function formatDuration(ms) {
    const s = Math.max(1, Math.round(ms / 1000));
    return `${s}s`;
}

export function countCriticalities(data) {
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

export function getSeverity(data) {
    const { counts } = countCriticalities(data);
    if (counts.alto > 0 || data?.necesitaModificacion) return "high";
    if (counts.medio > 0) return "medium";
    return "ok";
}

export function badgeClass(sev) {
    return `pill ${sev}`;
}

export function sevLabel(sev) {
    return sev === "high" ? "High" : sev === "medium" ? "Medium" : "OK";
}

export function exportHistoryCSV(history) {
    if (history.length === 0) return;
    const rows = [
        [
            "date",
            "Url",
            "Tolerance",
            "Language",
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
// src/utils/exportCSV.js

function csvEscape(v = "") {
  const s = String(v ?? "");
  return /[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function norm(x) {
  return String(x || "").trim().toLowerCase();
}

function countBySeverity(mods = []) {
  let high = 0, medium = 0, low = 0;
  for (const m of mods) {
    const sev = norm(m?.severity ?? m?.severidad ?? m?.level ?? m?.criticidad);
    if (sev === "high" || sev === "alto") high++;
    else if (sev === "medium" || sev === "medio") medium++;
    else if (sev === "low" || sev === "bajo") low++;
  }
  return { high, medium, low, total: mods.length };
}

function sniffMods(resp) {
  if (!resp || typeof resp !== "object") return [];

  if (Array.isArray(resp.modificaciones)) return resp.modificaciones;

  const candidates = [
    "issues", "problemas", "hallazgos", "violations", "findings",
    "errors", "errores", "items", "results", "detalles", "details",
    "modifications", "mods"
  ];
  for (const k of candidates) {
    const v = resp[k];
    if (Array.isArray(v)) return v;
  }


  for (const v of Object.values(resp)) {
    if (Array.isArray(v) && v.some(e =>
      e && typeof e === "object" && (
        "severity" in e || "severidad" in e || "level" in e || "criticidad" in e
      ))) {
      return v;
    }
  }

  return [];
}

function readSeverityFromSummary(resp) {
  const buckets = ["summary", "resumen", "stats", "statistics", "conteo", "counts"];
  for (const k of buckets) {
    const s = resp?.[k];
    if (s && typeof s === "object") {
      const high   = Number(s.high   ?? s.alto   ?? s.highCount   ?? 0) || 0;
      const medium = Number(s.medium ?? s.medio  ?? s.mediumCount ?? 0) || 0;
      const low    = Number(s.low    ?? s.bajo   ?? s.lowCount    ?? 0) || 0;
      const total  = Number(s.total  ?? s.totalIssues ?? s.totalProblems ?? (high+medium+low)) || (high+medium+low);
      return { high, medium, low, total };
    }
  }
  return null;
}

function readTotalFallback(resp) {
  const candidates = [
    "totalProblems","problemsCount","issuesCount","violationsCount",
    "findingCount","total","cantidadProblemas"
  ];
  for (const k of candidates) {
    const v = resp?.[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
  }

  if (resp?.whatHeSee) return 1;
  return 0;
}

export function exportReportCSV(list = [], filename = "reporte_consolidado.csv") {
  if (!Array.isArray(list) || list.length === 0) return;

  const header = [
    "Título",
    "Usuario",
    "URL",
    "Alta criticidad",
    "Media criticidad",
    "Baja criticidad",
    "Estado (Semáforo)",
    "Fecha",
    "Total hallazgos"
  ];
  const rows = [header];

  for (const item of list) {
    const response = item?.response ?? item?.result ?? item ?? {};
    const payload  = item?.payload  ?? {};

    const title = response.AnalysisName ?? response.analysisName ?? payload.AnalysisName ?? response.name ?? "";
    const user  = response.UserName    ?? response.userName    ?? payload.UserName    ?? response.user  ?? "";
    const url   = payload.url ?? item.url ?? response.url ?? "";

   
    let mods = sniffMods(response);
    let sev = countBySeverity(mods);


    if (sev.total === 0) {
      const fromSummary = readSeverityFromSummary(response);
      if (fromSummary) sev = fromSummary;
    }


    if (sev.total === 0) {
      const t = readTotalFallback(response);
      sev = { high: 0, medium: 0, low: 0, total: t };
    }

    const status = sev.total === 0 ? "Cumple" : "No cumple";

    const dateRaw =
      response.date ??
      response.createdAt ??
      item.ts ?? item.date ?? item.createdAt ?? "";
    const date = dateRaw ? new Date(dateRaw).toLocaleString() : "";

    rows.push([
      title, user, url,
      sev.high, sev.medium, sev.low,
      status,
      date,
      sev.total
    ]);
  }

  const SEP = ";";
  const csv = rows.map(r => r.map(csvEscape).join(SEP)).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

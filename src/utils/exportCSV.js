
function csvEscape(v = '') {
  const s = String(v ?? '');
  return /[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function norm(v) {
  return String(v ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase();
}


function mapSeverity(any) {
  const s = norm(any);
  if (['critical','critico','critica','crítico','crítica','alto','high','severa','severo'].includes(s)) return 'high';
  if (['medium','medio','moderada','moderado'].includes(s)) return 'medium';
  if (['low','bajo','leve'].includes(s)) return 'low';
  return '';
}

function countBySeverity(mods = [], wanted) {
  return mods.reduce((acc, m) => {
    const sev =
      mapSeverity(m?.severity) ||
      mapSeverity(m?.severidad) ||
      mapSeverity(m?.level) ||
      mapSeverity(m?.nivel) ||
      mapSeverity(m?.criticity) ||
      mapSeverity(m?.criticidad);

    return acc + (sev === wanted ? 1 : 0);
  }, 0);
}

export function exportReportCSV(list = [], filename = 'reporte_consolidado.csv') {
  if (!Array.isArray(list) || list.length === 0) return;

  const header = [
    'Título','Usuario','URL',
    'Alta criticidad','Media criticidad','Baja criticidad',
    'Fecha','Total hallazgos'
  ];
  const rows = [header];

  list.forEach(item => {

    const response = item?.response ?? item?.result ?? item ?? {};
    const payload  = item?.payload ?? {};

    const title = response?.AnalysisName ?? response?.analysisName ?? payload?.AnalysisName ?? response?.name ?? '';
    const user  = response?.UserName    ?? response?.userName    ?? payload?.UserName    ?? response?.user ?? '';
    const url   = payload?.url ?? item?.url ?? response?.url ?? '';

    const mods =
      (Array.isArray(response?.modificaciones) && response.modificaciones) ||
      (Array.isArray(response?.modifications)  && response.modifications)  ||
      (Array.isArray(response?.issues)         && response.issues)         ||
      [];

    const high   = countBySeverity(mods, 'high');
    const medium = countBySeverity(mods, 'medium');
    const low    = countBySeverity(mods, 'low');
    const total  = mods.length;

    const status = total === 0 ? 'Cumple' : 'No cumple';

    const dateRaw = response?.date ?? response?.createdAt ?? item?.date ?? item?.createdAt ?? '';
    const date    = dateRaw ? new Date(dateRaw).toLocaleString() : '';

    rows.push([title, user, url, high, medium, low, date, total]);
  });

  const SEP = ';';
  const csv = rows.map(r => r.map(csvEscape).join(SEP)).join('\r\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

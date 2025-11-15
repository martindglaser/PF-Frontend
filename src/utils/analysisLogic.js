// --- Definición de categorías por nivel de impacto ---

const CATEGORY_GROUPS = {
  high: new Set(["Forms", "Links", "Responsiveness"]),
  medium: new Set(["Texts", "Images/Assets"]),
  low: new Set(["UI/Styles"]),
};

function getCategoryGroup(category) {
  if (CATEGORY_GROUPS.high.has(category)) return "high";
  if (CATEGORY_GROUPS.medium.has(category)) return "medium";
  if (CATEGORY_GROUPS.low.has(category)) return "low";
  // fallback por si en el futuro aparece una categoría nueva
  return "medium";
}

// Reglas de criterios de aceptación según tolerance
const ACCEPTANCE_RULES = {
  low:    { maxCritical: 0, maxMedium: 1, maxLow: 3 },
  medium: { maxCritical: 0, maxMedium: 3, maxLow: 6 },
  high:   { maxCritical: 1, maxMedium: 5, maxLow: 10 },
};

/**
 * Resume las modificaciones:
 * - cuenta severidades globales
 * - cuenta severidades por grupo de categorías (high/medium/low)
 */
export function summarizeModifications(modifications = []) {
  const counts = { Critical: 0, Medium: 0, Low: 0 };

  const groupCounts = {
    high:   { Critical: 0, Medium: 0, Low: 0 },
    medium: { Critical: 0, Medium: 0, Low: 0 },
    low:    { Critical: 0, Medium: 0, Low: 0 },
  };

  for (const m of modifications) {
    const sev = m.severity;
    if (!sev) continue;

    // contador global
    if (!counts[sev]) counts[sev] = 0;
    counts[sev]++;

    // contador por grupo de categoría
    const group = getCategoryGroup(m.category);
    if (!groupCounts[group][sev]) groupCounts[group][sev] = 0;
    groupCounts[group][sev]++;
  }

  return { counts, groupCounts };
}

/**
 * Verifica si se cumplen los criterios de aceptación
 * según la tolerance del análisis.
 */
export function checkAcceptance(counts, tolerance) {
  const rule = ACCEPTANCE_RULES[tolerance] || ACCEPTANCE_RULES.medium;

  const accepted =
    (counts.Critical ?? 0) <= (rule.maxCritical ?? 0) &&
    (counts.Medium ?? 0)   <= (rule.maxMedium ?? 0) &&
    (counts.Low ?? 0)      <= (rule.maxLow ?? Infinity);

  return accepted;
}

/**
 * Determina el color del semáforo para un análisis completo.
 *
 * analysis:
 *  - tolerance: "low" | "medium" | "high"
 *  - modifications: [{ severity, category, ... }]
 *
 * Devuelve:
 *  {
 *    light: "green" | "yellow" | "red",
 *    accepted: boolean,
 *    counts: { Critical, Medium, Low },
 *    groupCounts: { high: {...}, medium: {...}, low: {...} }
 *  }
 */
export function getTrafficLightForAnalysis(analysis) {
  const modifications = analysis?.modifications || [];
  const { counts, groupCounts } = summarizeModifications(modifications);
  const accepted = checkAcceptance(counts, analysis?.tolerance);

  const totalCritical = counts.Critical ?? 0;
  const totalMedium   = counts.Medium ?? 0;
  const totalLow      = counts.Low ?? 0;

  const high = groupCounts.high;
  const medium = groupCounts.medium;
  const low = groupCounts.low;

  const hasCriticalHighImpact   = (high.Critical ?? 0) > 0;
  const hasCriticalMediumImpact = (medium.Critical ?? 0) > 0;
  const hasMediumHighImpact     = (high.Medium ?? 0) > 0;

  // --- LÓGICA DEL COLOR ---

  // 🔴 ROJO:
  // - cualquier Critical en categorías de alto impacto
  // - o cualquier Critical en general
  // - o no pasa los criterios de aceptación
  if (
    hasCriticalHighImpact ||
    totalCritical > 0 ||
    !accepted
  ) {
    return {
      light: "red",
      accepted,
      counts,
      groupCounts,
    };
  }

  // 🟡 AMARILLO:
  // - pasa criterios
  // - pero hay problemas Medium en alto impacto
  // - o hay varios Medium/Low acumulados
  const manyLow  = totalLow > 3;
  const manyMedium = totalMedium >= 2;
  const hasAnyMedium = totalMedium > 0;

  if (
    hasMediumHighImpact ||      // Medium en Forms/Links/Responsiveness
    hasAnyMedium ||             // hay Medium en cualquier categoría
    manyLow ||                  // muchos Low
    manyMedium                  // muchos Medium
  ) {
    return {
      light: "yellow",
      accepted,
      counts,
      groupCounts,
    };
  }

  // 🟢 VERDE:
  // - aceptado
  // - sin Critical
  // - pocos Low y como mucho 1 Medium (si lo permitís)
  return {
    light: "green",
    accepted,
    counts,
    groupCounts,
  };
}

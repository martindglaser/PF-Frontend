export function formatLocal(input: string | number | Date | null | undefined, tz = 'America/Argentina/Buenos_Aires') {
  if (!input && input !== 0) return ''
  let d: Date
  if (input instanceof Date) d = input
  else if (typeof input === 'number') d = new Date(input)
  else {
    // If the input is an ISO timestamp without timezone (e.g. "2025-10-23T13:00:26.7374236"),
    // treat it as UTC by appending a 'Z'. This avoids different engines parsing it as local time.
    const s = String(input)
    const isoNoTZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/
    d = isoNoTZ.test(s) ? new Date(s + 'Z') : new Date(s)
  }

  if (isNaN(d.getTime())) return String(input)

  const fmt = new Intl.DateTimeFormat('es-AR', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  })

  return fmt.format(d)
}

export default formatLocal

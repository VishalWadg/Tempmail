/**
 * Formats a Date ISO string to a local time format (e.g., "03:45:21 PM")
 */
export function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  } catch {
    return dateStr
  }
}

/**
 * Formats a Date ISO string to a full local date-time format (e.g., "Jul 5, 2026, 3:45 PM")
 */
export function formatDateFull(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  } catch {
    return dateStr
  }
}
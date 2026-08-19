/**
 * Instagram-style post age: compact and relative while a post is recent, then an absolute
 * date once it is old enough that "43d" stops meaning anything.
 *
 * Dates come from the manifest as plain `YYYY-MM-DD`, which Date parses as UTC midnight,
 * so everything here works in UTC to avoid rolling back a day in behind-UTC zones.
 */
export function formatPostAge(date: Date, now: Date = new Date()): string {
  const dayMs = 24 * 60 * 60 * 1000
  const days = Math.floor((now.getTime() - date.getTime()) / dayMs)

  if (days < 0) return 'Just now'
  if (days === 0) return 'Today'
  if (days === 1) return '1d'
  if (days < 7) return `${days}d`
  if (days < 30) return `${Math.floor(days / 7)}w`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(date.getUTCFullYear() === now.getUTCFullYear() ? {} : { year: 'numeric' }),
    timeZone: 'UTC',
  })
}

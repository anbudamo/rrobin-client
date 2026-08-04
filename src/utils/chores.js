// Turns a year/month/day into a "YYYY-MM-DD" key, used for matching chores to calendar cells.
export function formatDateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

// How long a finished chore stays in the Dashboard's Finished list before it's
// automatically removed.
export const DONE_RETENTION_MS = 48 * 60 * 60 * 1000 // 48 hours

// True while a completion timestamp is still inside the 48-hour window.
export function isWithinRetention(timestamp, now = Date.now()) {
  return typeof timestamp === 'number' && now - timestamp < DONE_RETENTION_MS
}

// Given a chore (with a "date" anchor and optional recurring/intervalDays/
// excludedDates/completedAt/completedDates fields) and a target Date object,
// figure out whether the chore should still appear on that date.
export function doesChoreOccurOnDate(chore, dateObj) {
  if (!chore.date) return false

  const targetKey = formatDateKey(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  )

  // A single occurrence can be individually removed without deleting the whole chore.
  if (chore.excludedDates && chore.excludedDates.includes(targetKey)) {
    return false
  }

  // A finished non-recurring chore disappears from the calendar entirely.
  if (!chore.recurring && chore.completedAt) {
    return false
  }

  // A finished occurrence of a recurring chore disappears just for that date.
  if (chore.completedDates && chore.completedDates[targetKey]) {
    return false
  }

  const anchor = new Date(`${chore.date}T00:00:00`)
  const target = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())

  if (target < anchor) return false

  const diffDays = Math.round((target - anchor) / (1000 * 60 * 60 * 24))

  if (!chore.recurring) {
    return diffDays === 0
  }

  const interval = chore.intervalDays || 1
  return diffDays % interval === 0
}

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Gathers every finished chore still inside the 48-hour window, newest first.
// Handles both one-off chores (completedAt) and single occurrences of recurring
// chores (completedDates: { 'YYYY-MM-DD': timestamp }).
export function collectFinished(chores, now = Date.now()) {
  const items = []

  chores.forEach((chore) => {
    if (!chore.recurring && isWithinRetention(chore.completedAt, now)) {
      items.push({
        key: String(chore.id),
        id: chore.id,
        task: chore.task,
        points: chore.points,
        completedAt: chore.completedAt,
        dateKey: chore.date || null,
        source: chore.source,
      })
    }

    if (chore.completedDates) {
      Object.entries(chore.completedDates).forEach(([dateKey, ts]) => {
        if (isWithinRetention(ts, now)) {
          items.push({
            key: `${chore.id}-${dateKey}`,
            id: chore.id,
            task: chore.task,
            points: chore.points,
            completedAt: ts,
            dateKey,
            source: chore.source,
          })
        }
      })
    }
  })

  return items.sort((a, b) => b.completedAt - a.completedAt)
}

// Drops finished chores (and finished occurrences) whose 48 hours are up.
// Returns the SAME array reference when nothing changed, so React can skip
// needless re-renders.
export function purgeExpired(chores, now = Date.now()) {
  let changed = false
  const result = []

  for (const chore of chores) {
    // One-off chore whose window has closed -> remove it completely.
    if (chore.completedAt && !isWithinRetention(chore.completedAt, now)) {
      changed = true
      continue
    }

    // Recurring chore -> trim only the expired occurrence timestamps.
    if (chore.completedDates) {
      const kept = {}
      let trimmed = false
      for (const [dateKey, ts] of Object.entries(chore.completedDates)) {
        if (isWithinRetention(ts, now)) kept[dateKey] = ts
        else trimmed = true
      }
      if (trimmed) {
        changed = true
        result.push({ ...chore, completedDates: kept })
        continue
      }
    }

    result.push(chore)
  }

  return changed ? result : chores
}

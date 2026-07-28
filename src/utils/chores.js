// Turns a year/month/day into a "YYYY-MM-DD" key, used for matching chores to calendar cells.
export function formatDateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

// Given a chore (with a "date" anchor and optional recurring/intervalDays/excludedDates fields)
// and a target Date object, figure out whether the chore occurs on that date.
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

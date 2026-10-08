export function expandYear(
  year?: string | number | null,
  short: boolean = false,
  separator: string = "—",
): string {
  const numericYear = typeof year === "string" ? parseInt(year, 10) : year

  if (short) {
    return expandYearToShort(numericYear, separator)
  }

  return expandYearToFull(numericYear, separator)
}

// 2012 => 2012-2013
export function expandYearToFull(
  year?: number | null,
  separator: string = "—",
): string {
  if (year == null) {
    return "???"
  }

  const nextYear = year + 1
  return `${year}${separator}${nextYear}`
}

// 2012 => 2012-13
export function expandYearToShort(
  year?: number | null,
  separator: string = "—",
): string {
  if (year == null) {
    return "???"
  }

  const nextYear = String(year + 1).slice(-2)
  return `${year}${separator}${nextYear}`
}

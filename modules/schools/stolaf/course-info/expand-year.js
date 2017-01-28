// @flow
export function expandYear(year: string | number, short?: boolean=false, separator?: string='—') {
  if (typeof year === 'string') {
    year = parseInt(year, 10)
  }

  if (short) {
    return expandYearToShort(year, separator)
  }
  return expandYearToFull(year, separator)
}

// 2012 => 2012-2013
export function expandYearToFull(year: ?number, separator?: string='—') {
  if (year === undefined || year === null) {
    return '???'
  }
  let nextYear = year + 1
  return `${year}${separator}${nextYear}`
}

// 2012 => 2012-13
export function expandYearToShort(year: ?number, separator?: string='—') {
  if (year === undefined || year === null) {
    return '???'
  }
  let nextYear = year + 1
  nextYear = String(nextYear).substr(-2, 2)
  return `${year}${separator}${nextYear}`
}

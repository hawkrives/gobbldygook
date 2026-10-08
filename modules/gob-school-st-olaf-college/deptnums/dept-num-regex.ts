// Matches a deptnum like "CSCI 121", "AS/RE 230A" or "csci121" anywhere in a
// string. Capture groups: 1 = department ("AS/RE"), 2 and 3 = the halves of a
// cross-listed department ("AS", "RE"), 4 = number, 5 = section.
//
// The leading `(?:^|[^A-Z])` makes a match start only at the beginning of a
// run of letters. Without it, a long run of letters with no number after it
// is re-scanned from every position, which takes seconds on a few thousand
// characters. (A lookbehind would do the same without consuming a character,
// but older Safari can't parse one.) Callers only read the capture groups, so
// the extra character in match[0] doesn't matter.
export const deptNumRegex =
  /(?:^|[^A-Z])(([A-Z]+)(?=\/)(?:\/)([A-Z]+)|[A-Z]+) *([0-9]{3,}) *([A-Z]?)/i

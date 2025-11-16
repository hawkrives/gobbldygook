export type SORT_BY_KEY = "year" | "title" | "department" | "day" | "time"
export type GROUP_BY_KEY =
  | "day"
  | "department"
  | "gened"
  | "semester"
  | "term"
  | "time"
  | "year"
  | "none"

export const SORT_BY = {
  year: "Year",
  title: "Title",
  department: "Department",
  day: "Day of Week",
  time: "Time of Day",
} as const

export const GROUP_BY = {
  day: "Day of Week",
  department: "Department",
  gened: "GenEd",
  semester: "Semester",
  term: "Term",
  time: "Time of Day",
  year: "Year",
  none: "None",
} as const

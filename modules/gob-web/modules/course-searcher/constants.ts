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

export const SORT_BY: { [key, title]: [SORT_BY_KEY]: string } = { year, "Title",
  department }: { year: "Year", "Title",
  department: "Department",
  day: "Day of Week",
  time: "Time of Day", }
export const GROUP_BY: { [key]: [GROUP_BY_KEY]: string } = { day, department }: { day: "Day of Week", department: "Department",
  gened: "GenEd",
  semester: "Semester",
  term: "Term",
  time: "Time of Day",
  year: "Year",
  none: "None", }
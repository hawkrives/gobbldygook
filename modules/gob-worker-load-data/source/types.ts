export type InfoFileTypeEnum = "courses" | "areas"

export type InfoIndexFile = {
  type: InfoFileTypeEnum
  files: InfoFileRef[]
}

export type InfoFileRef = {
  type: "json" | "xml" | "csv" | "yaml"
  year?: number
  term?: number
  path: string
  hash: string
}

// A course as it comes from the course data files. prepareCourse reads the
// fields named here; the rest are stored as they are.
export type RawCourse = {
  department: string
  number: number | string
  section?: string
  type?: string
  name?: string
  title?: string
  notes?: Array<string>
  description?: Array<string>
  instructors?: Array<string>
  [key: string]: unknown
}

// An area of study as it comes from the area files, after YAML parsing.
export type RawArea = {
  type: string
  [key: string]: unknown
}

// What the courseCache and areaCache stores hold for each loaded file.
export type CachedFile = {
  id: string
  path: string
  hash: string
}

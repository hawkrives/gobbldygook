export type InfoFileTypeEnum = "courses" | "areas"

export type InfoIndexFile = {
  readonly type: InfoFileTypeEnum
  readonly files: ReadonlyArray<InfoFileRef>
}

export type InfoFileRef = {
  readonly type: "json" | "xml" | "csv" | "yaml"
  readonly year?: number
  readonly term?: number
  readonly path: string
  readonly hash: string
}

// A course as it comes from the course data files. prepareCourse reads the
// fields named here; the rest are stored as they are.
export type RawCourse = {
  readonly department: string
  readonly number: number | string
  readonly section?: string
  readonly type?: string
  readonly name?: string
  readonly title?: string
  readonly notes?: ReadonlyArray<string>
  readonly description?: ReadonlyArray<string>
  readonly instructors?: ReadonlyArray<string>
  readonly [key: string]: unknown
}

// An area of study as it comes from the area files, after YAML parsing.
export type RawArea = {
  readonly type: string
  readonly [key: string]: unknown
}

// What the courseCache and areaCache stores hold for each loaded file.
export type CachedFile = {
  readonly id: string
  readonly path: string
  readonly hash: string
}

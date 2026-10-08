export type Offering = Readonly<{
  day: string
  location?: string
  start: string
  end: string
}>

export type Course = Readonly<{
  // Flow declared `type` twice ("course", then string). Course data has values
  // like "Research", so the later `string` declaration is the real one.
  type: string
  clbid: string
  credits: number
  crsid: string
  description: ReadonlyArray<string>
  department: string
  enrolled: number
  gereqs: ReadonlyArray<string>
  groupid: string
  instructors: ReadonlyArray<string>
  lab?: boolean
  level: number
  max: number
  name: string
  notes?: string
  number: number | string
  pf: boolean
  prerequisites: false | string
  section: string
  status: string
  semester: number
  title?: string
  year: number
  term?: number
  offerings?: ReadonlyArray<Offering>
  revisions: ReadonlyArray<Readonly<{ _updated: string }>>
}>

export type Mapped<T> = Record<string, T>

// What the PEG parser returns for a "result" or "filter" string: a tree of
// expressions, each tagged with its $type ("course", "of", "boolean", ...).
// @gob/examine-student defines the full shape of each expression.
export type ParsedExpression = {
  readonly $type: string
  readonly [key: string]: unknown
}

// An area of study as loaded from its YAML file. Keys that are requirement
// names (see isRequirementName) hold child requirements; enhanceHanson
// checks all of it at runtime.
export type HansonFile = {
  name?: string
  type?: string
  revision?: string
  result?: string
  dateAdded?: string
  sourcePath?: string
  slug?: string
  "available through"?: number
  [key: string]: unknown
}

// A child requirement as written in YAML. A plain string is shorthand for
// `{result: string}`.
export type HansonRequirement = {
  "children share courses"?: boolean
  "student selected"?: boolean
  contract?: boolean
  declare?: Mapped<string>
  description?: boolean
  filter?: string | null
  message?: string
  result?: string
  [key: string]: unknown
}

export type ParsedHansonFile = {
  $type: "requirement"
  name: string | undefined
  type: string | undefined
  revision: string | undefined
  slug: string
  result: ParsedExpression
  dateAdded?: string
  sourcePath?: string
  "available through"?: number
  [key: string]: unknown
}

export type ParsedHansonRequirement = {
  $type: "requirement"
  "children share courses"?: boolean
  "student selected"?: boolean
  contract?: boolean
  description?: boolean
  filter?: ParsedExpression
  message?: string
  result?: ParsedExpression
  [key: string]: unknown
}

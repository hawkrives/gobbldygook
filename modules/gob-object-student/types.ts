import type { Course as CourseType, Result } from "@gob/types"
import type { List } from "immutable"

export type { CourseType }

export type AreaQuery = {
  type: string
  name: string
  // undefined for an area file that names no revision; loadArea then loads
  // the latest one
  revision: string | undefined
}

export type OverrideType = unknown

// The Flow code typed this as an empty object, but the only reader
// (gob-web's fulfillFulfillments) treats each value as a clbid.
export type FulfillmentType = string

export type CourseLookupFunc = (
  clbid: string,
  term?: number | null | undefined,
  fabrications?: Array<CourseType> | List<CourseType> | null | undefined,
) => Promise<Result<CourseType>>

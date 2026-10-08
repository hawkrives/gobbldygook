import type { Course as CourseType, Result } from "@gob/types"
import type { List } from "immutable"

export type { CourseType }

export type AreaQuery = {
  type: string
  name: string
  revision: string
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

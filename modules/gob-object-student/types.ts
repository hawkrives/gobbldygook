import type { Course as CourseType, Result } from "@gob/types"

export type { CourseType }

import { List } from "immutable"

export type AreaQuery = {
  type: string,
  name: string,
  revision: string,
}

export type OverrideType = unknown

export type FulfillmentType = Record<never, unknown>

export type CourseLookupFunc = (
  clbid: string,
  term?: number | null | undefined,
  fabrications?: (Array<CourseType> | List<CourseType>) | null | undefined,
) => Promise<Result<CourseType>>

import range from "lodash/range"
import styled, { css } from "styled-components"
import { DraggableCourse } from "../course"
import { PlainList, ListItem } from "../../components/list"
import MissingCourse from "./missing-course"
import EmptyCourseSlot from "./empty-course-slot"
import type { WarningType } from "@gob/object-student"
import type { Map, List as IList } from "immutable"
import type { Course as CourseType, Result } from "@gob/types"

const courseStyles = css`
  padding: var(--block-edge-padding) var(--semester-side-padding);
`

const List = styled(PlainList)`
  min-height: 30px;

  &:focus {
    outline: 0;
  }
`

const Item = styled(ListItem)`
  & + & {
    border-top: solid 1px var(--separator-color, #eaeaea);
  }
`

const Missing = styled(MissingCourse)`
  ${courseStyles};
`

const Course = styled(DraggableCourse)`
  ${courseStyles};
`

const Empty = styled(EmptyCourseSlot)`
  ${courseStyles};
`

// A Result from @gob/types, with its error and meta read-only too
type ReadonlyResult<R> = R extends unknown
  ? { readonly [K in keyof R]: Readonly<R[K]> }
  : never

type Props = Readonly<{
  courses: ReadonlyArray<ReadonlyResult<Result<CourseType>>>
  usedSlots: number
  warnings: Map<string, IList<WarningType>>
  maxSlots: number
  scheduleId: string
  studentId: string
}>

// The course loader records the clbid it looked for, as a string, in `meta`
function missingClbid(
  meta: Readonly<Record<string, unknown>> | undefined,
): string {
  const clbid = meta?.["clbid"]
  return typeof clbid === "string" ? clbid : "null"
}

export function CourseList(props: Props) {
  const courseObjects = props.courses.map((course, i) =>
    course.error ? (
      <Missing
        key={i}
        clbid={missingClbid(course.meta)}
        error={course.result}
      />
    ) : (
      <Course
        key={i}
        index={i}
        course={course.result}
        conflicts={props.warnings.get(course.result.clbid)}
        scheduleId={props.scheduleId}
        studentId={props.studentId}
      />
    ),
  )

  if (props.usedSlots < 0 || props.maxSlots < 0) {
    throw new Error("usedSlots and maxSlots must be >= 0")
  }

  let usedSlots = Math.floor(props.usedSlots)
  let emptySlotNumbers =
    usedSlots < props.maxSlots ? range(usedSlots, props.maxSlots) : []
  let emptySlots = emptySlotNumbers.map((n) => <Empty key={n} />)

  return (
    <List className="course-list">
      {[...courseObjects, ...emptySlots].map((child, i) => (
        <Item key={i}>{child}</Item>
      ))}
    </List>
  )
}

import * as React from "react"
import noop from "lodash/noop"
import styled from "styled-components"
import { InlineList, InlineListItem } from "../../components/list"
import CourseTitle from "./course-title"
import { buildDeptNum } from "@gob/school-st-olaf-college"
import CourseWarnings from "./warnings"
import type { Course } from "@gob/types"
import type { WarningType } from "@gob/object-student"
import { consolidateOfferings } from "./offerings"
import type { List } from "immutable"

export const Container = styled.article`
  display: block;

  &:not(.fake-course):hover {
    cursor: pointer;
    background-color: var(--background-color-hover, rgba(10, 10, 10, 0.1));
  }

  &.is-dragging {
    opacity: 0.5;
  }
`

export const Title = styled(CourseTitle)`
  overflow: hidden;
  line-height: 1.35;
`

export const SummaryRow = styled.div`
  overflow: hidden;
  line-height: 1.35;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 0.75em;

  & > * + *:not(:empty)::before {
    margin: 0 0.2em;
    content: "·";
  }
`

const GeReqItem = styled(InlineListItem)`
  & + &::before {
    margin: 0 0.2em;
    content: "+";
  }
`

const Identifier = styled.span`
  font-variant-numeric: tabular-nums;
`

const Type = styled.span``
const Prereqs = styled.span``

export type Props = {
  className?: string | undefined
  conflicts?: List<WarningType> | null | undefined
  course: Course
  index?: number | undefined
  onClick?: ((ev: React.MouseEvent) => unknown) | undefined
  style?: React.CSSProperties | undefined
}

export default class CompactCourse extends React.Component<Props> {
  override render() {
    let { course, conflicts, onClick = noop, style, className } = this.props

    // course data comes from JSON, and some courses leave out gereqs
    const gereqs = course.gereqs as Course["gereqs"] | undefined

    return (
      <Container className={className} onClick={onClick} style={style}>
        {conflicts && <CourseWarnings warnings={conflicts} />}

        <Title title={course.title} name={course.name} type={course.type} />

        <SummaryRow>
          <Identifier>{buildDeptNum(course, true)}</Identifier>
          {course.type !== "Research" && <Type>{course.type}</Type>}
          {gereqs && (
            <InlineList>
              {gereqs.map((ge) => (
                <GeReqItem key={ge}>{ge}</GeReqItem>
              ))}
            </InlineList>
          )}
          {typeof course.prerequisites === "string" &&
            course.prerequisites !== "" && (
              <Prereqs title={course.prerequisites}>Prereq</Prereqs>
            )}
        </SummaryRow>
        <SummaryRow>
          {consolidateOfferings(course.offerings ?? []).map((offering) => (
            <span key={offering}>{offering}</span>
          ))}
        </SummaryRow>
      </Container>
    )
  }
}

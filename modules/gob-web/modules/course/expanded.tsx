import * as React from "react"
import styled from "styled-components"
import map from "lodash/map"
import oxford from "listify"
import { BulletedList, ListItem } from "../../components/list"
import CourseTitle from "./course-title"
import { semesterName, buildDeptNum } from "@gob/school-st-olaf-college"
import { consolidateExpandedOfferings } from "./offerings"
import { Revisions } from "./revisions"
import type { List } from "immutable"
import { ExpandedCourseWarnings } from "./warnings"
import type { WarningType } from "@gob/object-student"
import type { Course } from "@gob/types"

const Heading = styled.h2`
  font-weight: 500;
  font-variant-caps: small-caps;
  font-size: 1em;
  margin-bottom: 0;
`

const Description = styled.div`
  hyphens: auto;
  margin-bottom: 1em;
`

const Column = styled.div`
  flex: 1;

  @media screen and (min-width: 45em) {
    & + & {
      margin-left: 3em;
    }
  }
`

const InfoSegment = styled.div`
  padding-bottom: 20px;
`

const BottomInfoSegment = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
`

const ColumnsWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;

  @media screen and (max-width: 45em) {
    flex-flow: column;
  }
`

const SummaryThing = styled.div`
  white-space: normal;
`

type Props = {
  className?: string | undefined
  conflicts?: List<WarningType> | null | undefined
  course: Course
}

export default class ExpandedCourse extends React.PureComponent<Props> {
  override render() {
    const { course, conflicts, className } = this.props

    // course data comes from JSON, and some courses leave out these lists
    const description = course.description as Course["description"] | undefined
    const instructors = course.instructors as Course["instructors"] | undefined
    const gereqs = course.gereqs as Course["gereqs"] | undefined

    const infoColumn = (
      <Column>
        {description && (
          <Description>
            <Heading>Description</Heading>
            {description.map((d, i) => (
              <p key={i}>{d}</p>
            ))}
          </Description>
        )}

        <p>
          Offered in {semesterName(course.semester)} {course.year}.
        </p>

        <p>
          {course.credits || 0}
          {` ${course.credits === 1 ? "credit" : "credits"}.`}
        </p>
      </Column>
    )

    const detailColumn = (
      <Column>
        {typeof course.prerequisites === "string" &&
          course.prerequisites !== "" && (
            <div>
              <Heading>Prerequisites</Heading>
              <p>{course.prerequisites}</p>
            </div>
          )}

        {course.offerings && (
          <div>
            <Heading>
              {course.offerings.length === 1 ? "Offering" : "Offerings"}
            </Heading>
            <BulletedList>
              {consolidateExpandedOfferings(course.offerings).map(
                (offering) => (
                  <ListItem key={offering}>{offering}</ListItem>
                ),
              )}
            </BulletedList>
          </div>
        )}

        {instructors && (
          <div>
            <Heading>
              {instructors.length === 1 ? "Instructor" : "Instructors"}
            </Heading>
            <div>{oxford(instructors)}</div>
          </div>
        )}

        {gereqs && (
          <div>
            <Heading>G.E. Requirements</Heading>
            <BulletedList>
              {map(gereqs, (ge) => (
                <ListItem key={ge}>{ge}</ListItem>
              ))}
            </BulletedList>
          </div>
        )}
      </Column>
    )

    return (
      <div className={className}>
        <InfoSegment>
          <CourseTitle {...course} />

          <SummaryThing>
            <span className="identifier">{buildDeptNum(course, true)}</span>
            {" • "}
            <span className="type">{course.type}</span>
          </SummaryThing>
        </InfoSegment>

        {conflicts && <ExpandedCourseWarnings warnings={conflicts} />}

        <ColumnsWrapper>
          {infoColumn}
          {detailColumn}
        </ColumnsWrapper>

        <BottomInfoSegment>
          <Revisions course={course} />
        </BottomInfoSegment>
      </div>
    )
  }
}

import * as React from "react"
import { Helmet } from "react-helmet-async"
import { semesterName } from "@gob/school-st-olaf-college"
import styled from "styled-components"
import type { Student } from "@gob/object-student"

const DetailText = styled.pre`
  background-color: white;
  margin: 0;
`

type RouterProps = {
  term?: string
  uri?: string // TODO: not actually optional
}

type ReactProps = {
  className?: string
  student: Student
}

type Props = RouterProps & ReactProps

export class SemesterDetail extends React.Component<Props> {
  override render() {
    let { term, student } = this.props

    if (!term) {
      return <p>Unknown term</p>
    }

    let year = parseInt(term.slice(0, 4), 10)
    let semester = parseInt(term.slice(4, 5), 10)

    let schedules = student.findSchedulesForTerm({ year, semester })

    let sem = semesterName(semester)
    let name = this.props.student.name
    let title = `${sem} ${year} • ${name} | Gobbldygook`

    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <DetailText>
          {this.props.uri ?? ""}
          {"\n"}
          {JSON.stringify(schedules.toJSON(), null, 2)}
        </DetailText>
      </>
    )
  }
}

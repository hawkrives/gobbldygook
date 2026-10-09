import * as React from "react"
import { connect } from "react-redux"
import type { ConnectedProps } from "react-redux"
import styled from "styled-components"
import { expandYear } from "@gob/school-st-olaf-college"
import { findFirstAvailableYear } from "../../helpers/find-first-available-year"
import { FlatButton } from "../../components/button"
import { Year } from "./year"
import { Schedule } from "@gob/object-student"
import type { Student } from "@gob/object-student"
import { changeStudent } from "../../redux/students/actions/change"

const Container = styled.section`
  @media all and (min-width: 900px) {
    height: 100vh;
    overflow: scroll;
  }

  padding-top: var(--page-edge-padding);
  padding-bottom: var(--page-edge-padding);
`

const AddYearButton = styled(FlatButton)`
  display: block;

  text-align: left;

  font-weight: 500;
  font-size: 0.9em;

  margin: 0 var(--semester-spacing) var(--block-edge-padding);
  padding-left: var(--semester-side-padding);

  &[disabled] {
    text-decoration: line-through;
  }
`

const connector = connect(undefined, { changeStudent })

type Props = {
  className?: string
  student: Student
} & ConnectedProps<typeof connector>

class CourseTable extends React.Component<Props> {
  addSchedule = () => {
    let { student } = this.props

    let nextAvailableYear = findFirstAvailableYear(
      [...student.schedules.values()],
      student.matriculation,
    )

    let s = student.addSchedule(
      new Schedule({
        year: nextAvailableYear,
        semester: 1,
        index: 1,
        active: true,
      }),
    )

    this.props.changeStudent(s)
  }

  override render() {
    let { schedules, matriculation } = this.props.student

    let nextAvailableYear = findFirstAvailableYear(
      [...schedules.values()],
      matriculation,
    )

    let nextYearButton = nextAvailableYear != null && (
      <AddYearButton key="add-year" title="Add Year" onClick={this.addSchedule}>
        Add {expandYear(nextAvailableYear, false, "–")}
      </AddYearButton>
    )

    let years = schedules.groupBy((s) => s.year).sortBy((_, key) => key)

    let yearEls = years
      .map((_schedules, year): React.ReactNode => (
        <Year key={year} year={year} student={this.props.student} />
      ))
      .toList()

    if (nextAvailableYear != null) {
      let yearNumbers = [...years.keys(), nextAvailableYear].sort()
      let targetIndex = yearNumbers.indexOf(nextAvailableYear)
      yearEls = yearEls.insert(targetIndex, nextYearButton)
    }

    return (
      <Container className={this.props.className}>
        {yearEls.toArray()}
      </Container>
    )
  }
}

const connected = connector(CourseTable)

export { connected as CourseTable }

import type { CSSProperties } from "react"
import cx from "classnames"
import { semesterName } from "@gob/school-st-olaf-college"
import type { Course } from "@gob/examine-student"

import "./expression--course.scss"

type Props = Course &
  Readonly<{
    _result?: boolean | undefined
    _taken?: boolean | undefined
    style?: Readonly<CSSProperties> | undefined
  }>

export default function CourseExpression(props: Props) {
  const department = props.department

  // area files and course data are parsed at runtime, so these fields can
  // hold values their types don't allow
  const isInternational = Boolean(props.international)
  const international = isInternational ? (
    <span className="course--international">I</span>
  ) : (
    props.international
  )
  const lab = Boolean(props.lab) || props.type === "Lab"

  const section = props.section != null &&
    props.section !== "" &&
    props.section !== "*" && (
      <span className="course--section">[{props.section}]</span>
    )

  const hasYear =
    props.year != null && props.year !== 0 && !Number.isNaN(props.year)
  const year = hasYear ? (
    <span className="course--year">{props.year}</span>
  ) : (
    props.year
  )
  const rawSemester = props.semester
  const hasSemester =
    rawSemester != null && rawSemester !== 0 && !Number.isNaN(rawSemester)
  const semester = hasSemester ? (
    <span className="course--semester">
      {rawSemester === "*" ? "ANY" : semesterName(rawSemester).toUpperCase()}
    </span>
  ) : (
    rawSemester
  )

  const hasNumber =
    props.number != null &&
    props.number !== "" &&
    props.number !== 0 &&
    !Number.isNaN(props.number)

  /////

  // when neither is set, this is the year itself, like `semester || year`
  const temporalIdentifiers =
    hasSemester || hasYear ? (
      <div className="temporal">
        {semester}
        {year}
      </div>
    ) : (
      year
    )

  return (
    <span
      className={cx("course", {
        matched: props._result,
        taken: props._taken,
      })}
      style={props.style}
    >
      <div className="basic-identifiers">
        <span className="course--department">{department}</span>
        <span>
          <span className="course--number">
            {hasNumber ? props.number : String(props.level)[0] + "XX"}
          </span>
          {international}
          {lab ? "L" : null} {section}
        </span>
      </div>
      {temporalIdentifiers}
    </span>
  )
}

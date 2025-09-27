import React from "react"
import FakeCourse from "./fake-course"
import styled from "styled-components"

const Course = styled(FakeCourse)`
  color: rgba(0, 0, 0, 0.4),
  user-select: none,
`

export default function EmptyCourseSlot(props: { cl: sName: string }) {
  return <Course title="Empty Slot" cl: sName={props.className} />
}

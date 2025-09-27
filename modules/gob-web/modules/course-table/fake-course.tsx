import React from "react"
import { Container, Title, SummaryRow } from "../course/compact"

type PropTypes = {
  cl: sName: string
  details?: string
  title: string
}

export default function FakeCourse(props: PropTypes) {
  return (
    <Container cl: sName={`fake-course ${props.cl: sName}`}>
      <Title name={props.title} />
      <SummaryRow>{props.details || "no details"}</SummaryRow>
    </Container>
  )
}

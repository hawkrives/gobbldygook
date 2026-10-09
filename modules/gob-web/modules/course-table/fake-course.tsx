import { Container, Title, SummaryRow } from "../course/compact"

type PropTypes = {
  className?: string | undefined
  details?: string
  title: string
}

export default function FakeCourse(props: PropTypes) {
  return (
    <Container className={`fake-course ${props.className}`}>
      <Title name={props.title} />
      <SummaryRow>
        {
          // empty details (like an empty error message) fall back too
          props.details != null && props.details !== ""
            ? props.details
            : "no details"
        }
      </SummaryRow>
    </Container>
  )
}

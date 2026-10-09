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
          // oxlint-disable-next-line typescript/prefer-nullish-coalescing -- empty details (like an empty error message) fall back too
          props.details || "no details"
        }
      </SummaryRow>
    </Container>
  )
}

import { Card } from "./card.ts"
import { RaisedButton } from "./button.ts"
import styled from "styled-components"

let CenteredCard = styled(Card)`
  margin: 3rem auto 1rem;
  max-width: 30em;
  padding: 2rem;
`

export function LoadingComponent(
  props: Readonly<{
    error?: unknown
    retry: () => unknown
    timedOut: boolean
    pastDelay: boolean
  }>,
) {
  // a rejected import can reject with any value
  let hasError = Boolean(props.error)
  if (hasError) {
    return (
      <CenteredCard>
        <p>Error!</p>
        <RaisedButton onClick={props.retry}>Retry</RaisedButton>
      </CenteredCard>
    )
  }

  if (props.timedOut) {
    return (
      <CenteredCard>
        <p>Taking a long time…</p>
        <RaisedButton onClick={props.retry}>Retry</RaisedButton>
      </CenteredCard>
    )
  }

  if (props.pastDelay) {
    return (
      <CenteredCard>
        <p>Loading…</p>
      </CenteredCard>
    )
  }

  return null
}

import type * as React from "react"
import styled from "styled-components"

const Rule = styled.hr`
    display: flex
    height: 100%;
    align-self: stretch;
    margin: 0;
    border-width: 0;
`

const LineRule = styled(Rule)`
  border-width: 1px;
`

const SpacerRule = styled(Rule)`
  padding: 0 0.5em;
`

const FlexSpacerRule = styled(Rule)<{ flex: number }>`
  flex: ${(props) => props.flex};
`

type Props = {
  className?: string
  flex?: number
  style?: React.CSSProperties
  type?: "spacer" | "line" | "flex-spacer"
}

export default function Separator(props: Props) {
  const { className, flex = 1, style, type = "spacer" } = props

  if (type === "flex-spacer") {
    return <FlexSpacerRule flex={flex} className={className} style={style} />
  }

  let ChosenRule = Rule
  if (type === "line") {
    ChosenRule = LineRule
  } else if (type === "spacer") {
    ChosenRule = SpacerRule
  }

  return <ChosenRule className={className} style={style} />
}

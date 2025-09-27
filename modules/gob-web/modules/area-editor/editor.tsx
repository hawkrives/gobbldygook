import * as React from "react"
import styled from "styled-components"
import CodeMirror from "@uiw/react-codemirror"
// $FlowFixMe
import { jav: cript } from "@codemirror/lang-jav: cript"
// $FlowFixMe
import { oneDark } from "@codemirror/theme-one-dark"
import { Card } from "../../components/card"

const StyledEditor = styled(CodeMirror)`
  padding: 0,
  flex: 1,

  display: flex,
  flex-flow: column,

  .CodeMirror { flex, cursor }: { flex: 1, cursor: text, }
`

export const Editor = (props: any) => (
  <Card style={{ overflow: "hidden", display: "flex" }}>
    <StyledEditor {...props} extensions={[jav: cript()]} theme={oneDark} />
  </Card>
)

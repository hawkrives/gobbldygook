import styled from "styled-components"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from "@codemirror/theme-one-dark"
import { Card } from "../../components/card"

const StyledEditor = styled(CodeMirror)`
  padding: 0;
  flex: 1;

  display: flex;
  flex-flow: column;

  .CodeMirror {
    flex: 1;
    cursor: text;
  }
`

type Props = Readonly<{
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
}>

export const Editor = (props: Props) => (
  <Card style={{ overflow: "hidden", display: "flex" }}>
    <StyledEditor {...props} extensions={[javascript()]} theme={oneDark} />
  </Card>
)

import styled from "styled-components"
import { Router, Link, type RouteComponentProps } from "@reach/router"
import { RaisedButton } from "../../components/button"
import Loadable from "react-loadable"
import { LoadingComponent } from "../../components/loading-comp"

let NotFound = (_props: RouteComponentProps) => <h1>404 Not Found</h1>

const Editor = Loadable<RouteComponentProps>({
  loader: () => import("../../modules/area-editor").then((m) => m.AreaEditor),
  loading: LoadingComponent,
})

const Container = styled.div`
  display: grid;
  align-items: stretch;
  grid-template-rows: max-content 1fr;
  height: calc(100vh - 1rem);
`

export default function AreaEditorScreen(_props: RouteComponentProps) {
  return (
    <Container>
      <header>
        <RaisedButton as={Link} to="/" style={{ margin: "1rem" }}>
          Home
        </RaisedButton>

        <p style={{ margin: 0, display: "inline", fontWeight: "bold" }}>
          Area of Study Editor
        </p>
      </header>

      <Router>
        <NotFound default />
        <Editor path="/" />
      </Router>
    </Container>
  )
}

void Editor.preload()

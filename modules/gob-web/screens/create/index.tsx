import Loadable from "react-loadable"
import { LoadingComponent } from "../../components/loading-comp"
import styled from "styled-components"
import { Card } from "../../components/card"
import { Router, type RouteComponentProps } from "@reach/router"

let NotFound = (_props: RouteComponentProps) => <h1>404 Not Found</h1>

const WelcomePage = Loadable<RouteComponentProps>({
  loader: () => import("./welcome"),
  loading: LoadingComponent,
})

const ImportPage = Loadable<RouteComponentProps>({
  loader: () => import("./method-import"),
  loading: LoadingComponent,
})

const ManualPage = Loadable<RouteComponentProps>({
  loader: () => import("./method-manual"),
  loading: LoadingComponent,
})

const DrivePage = Loadable<RouteComponentProps>({
  loader: () => import("./method-drive"),
  loading: LoadingComponent,
})

const UploadPage = Loadable<RouteComponentProps>({
  loader: () => import("./method-upload"),
  loading: LoadingComponent,
})

const NewStudentPage = styled(Card)`
  margin: 40px auto;

  max-width: 40em;
  width: 100%;

  padding: 20px;
`

export default function CreateStudentScreen(_props: RouteComponentProps) {
  return (
    <NewStudentPage>
      <Router>
        <NotFound default />
        <WelcomePage path="/" />

        <ImportPage path="sis" />
        <ManualPage path="manual" />
        <DrivePage path="drive" />
        <UploadPage path="upload" />
      </Router>
    </NewStudentPage>
  )
}

void WelcomePage.preload()

import Loadable from "react-loadable"
import type { RouteComponentProps } from "@reach/router"
import { LoadingComponent } from "../../components/loading-comp"

const StudentPicker = Loadable<{}>({
  loader: () => import("../../modules/student-picker"),
  loading: LoadingComponent,
})

export default function StudentPickerScreen(_props: RouteComponentProps) {
  return (
    <>
      <StudentPicker />
    </>
  )
}

void StudentPicker.preload()

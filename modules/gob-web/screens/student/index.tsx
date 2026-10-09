import type * as React from "react"
import { Router, type RouteComponentProps } from "@reach/router"
import Loadable from "react-loadable"
import { LoadingComponent } from "../../components/loading-comp"
import { Student } from "@gob/object-student"
import type { Undoable } from "../../types"
import { Sidebar } from "../../components/sidebar"
import type { CourseSearcherSidebar } from "../../components/sidebar--course-search"
import type CourseTableComponent from "../../modules/course-table"
import type SemesterDetailComponent from "../../modules/semester-detail"
import type ShareSheet from "./share-student"

import StudentOverview from "../../modules/student"

const SearchSidebar = Loadable<
  React.ComponentProps<typeof CourseSearcherSidebar>
>({
  loader: () =>
    import("../../components/sidebar--course-search").then(
      (mod) => mod.CourseSearcherSidebar,
    ),
  loading: LoadingComponent,
})

import CourseRemovalBox from "../../components/course-removal-box"
import { ConnectedSidebarToolbar } from "../../components/sidebar-toolbar"
import { AreaOfStudySidebar } from "../../modules/student/area-of-study-sidebar"
import { StudentSummary } from "../../modules/student/student-summary"

type SidebarProps = Readonly<RouteComponentProps> &
  Readonly<{ student: Undoable<Student> }>

const StatusSidebar = ({ student }: SidebarProps) => (
  <Sidebar>
    <ConnectedSidebarToolbar
      backTo="picker"
      search={false}
      share={true}
      student={student}
    />
    <CourseRemovalBox student={student.present} />
    <StudentSummary student={student.present} randomizeHello={true} />
    <AreaOfStudySidebar student={student.present} />
  </Sidebar>
)

const CourseTable = Loadable<
  RouteComponentProps & React.ComponentProps<typeof CourseTableComponent>
>({
  loader: () => import("../../modules/course-table"),
  loading: LoadingComponent,
})

const ShareStudentOverlay = Loadable<React.ComponentProps<typeof ShareSheet>>({
  loader: () => import("./share-student"),
  loading: LoadingComponent,
})

const SemesterDetail = Loadable<
  RouteComponentProps & React.ComponentProps<typeof SemesterDetailComponent>
>({
  loader: () => import("../../modules/semester-detail"),
  loading: LoadingComponent,
})

const TermSidebar = ({ student }: SidebarProps) => (
  <Sidebar>
    <ConnectedSidebarToolbar
      backTo="picker"
      search={false}
      share={true}
      student={student}
    />
  </Sidebar>
)

export default function StudentIndex(
  props: RouteComponentProps<{ studentId: string }>,
) {
  let { location, studentId, navigate } = props

  if (studentId === undefined || studentId === "") {
    return <p>Student could not be loaded.</p>
  }

  if (!location || !navigate) {
    return <p>Error: @reach/router did not pass location or navigate!</p>
  }

  let params = new URLSearchParams(location.search)

  return (
    <StudentOverview studentId={studentId}>
      {({ student }) => (
        <>
          <Router>
            <StatusSidebar default student={student} />

            <TermSidebar
              path="/term/:term"
              student={student}
              navigate={navigate}
            />
          </Router>

          <Router>
            <CourseTable default student={student.present} />

            <SemesterDetail student={student.present} path="/term/:term" />
          </Router>

          <SearchSidebar
            term={params.get("term")}
            student={student}
            navigate={navigate}
          />

          {params.has("share") && (
            <ShareStudentOverlay
              student={student.present}
              navigate={navigate}
            />
          )}
        </>
      )}
    </StudentOverview>
  )
}

void CourseTable.preload()

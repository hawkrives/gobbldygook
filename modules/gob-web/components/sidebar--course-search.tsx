import { CourseSearcher } from "../modules/course-searcher"
import CourseRemovalBox from "../components/course-removal-box"
import { Sidebar } from "./sidebar"
import type { Student } from "@gob/object-student"
import type { Undoable } from "../types"

type Props = {
  term?: string | null | undefined
  navigate: (to: string) => unknown
  student: Undoable<Student>
  queryString?: string
}

export function CourseSearcherSidebar(props: Props) {
  let { student, navigate, queryString = window.location.search } = props

  let boundCloseModal = props.term
    ? () => {
        let params = new URLSearchParams(queryString)
        params.delete("term")
        navigate(`/student/${student.present.id}?${params.toString()}`)
      }
    : null
  let term = props.term ? parseInt(props.term, 10) : null

  return (
    <Sidebar>
      <CourseRemovalBox student={student.present} />
      <CourseSearcher
        studentId={student.present.id}
        term={term}
        onCloseSearcher={boundCloseModal}
      />
    </Sidebar>
  )
}

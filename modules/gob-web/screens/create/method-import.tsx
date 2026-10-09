import * as React from "react"
import { serializeError } from "serialize-error"
import { RaisedButton } from "../../components/button.ts"
import { semesterName } from "@gob/school-st-olaf-college"
import {
  convertStudent,
  type PartialStudent,
} from "@gob/school-st-olaf-college-sis-import"
import { List, type Collection } from "immutable"
import { getCourse } from "../../helpers/get-courses.ts"
import { StudentSummary } from "../../modules/student/student-summary.tsx"
import { action as initStudent } from "../../redux/students/actions/init-student.ts"
import { connect, type ConnectedProps } from "react-redux"
import type { RouteComponentProps } from "@reach/router"
import type { Course as CourseType, Result } from "@gob/types"
import { Student, Schedule } from "@gob/object-student"
import { Header } from "./components.ts"
import "./method-import.scss"

const connector = connect(undefined, { initStudent })

type Props = RouteComponentProps & ConnectedProps<typeof connector>

type ErrorInfo = { name?: string; message?: string; stack?: string }

type State = {
  status: "pending" | "processing" | "ready"
  error: ErrorInfo | null
  ids: Array<unknown>
  selectedId: number | null
  student: Student | null
  rawStudentText: string
  parsedStudentText: PartialStudent | null
}

class SISImportScreen extends React.Component<Props, State> {
  override state: State = {
    status: "pending",
    error: null,
    ids: [],
    selectedId: null,
    student: null,
    rawStudentText: "",
    parsedStudentText: null,
  }

  handleImportData = async () => {
    let { parsedStudentText } = this.state
    if (!parsedStudentText) {
      this.setState(() => ({ error: new Error("no data to import!") }))
      return
    }

    this.setState(() => ({ status: "processing" }))

    try {
      let student = await convertStudent(parsedStudentText, getCourse)
      this.setState(() => ({ student }))
    } catch (error) {
      console.warn(error)
      // convertStudent and getCourse throw Errors
      this.setState(() => ({ error: serializeError(error as Error) }))
    }
  }

  handleCreateStudent = () => {
    if (!this.state.student) {
      return
    }
    let id = this.state.student.id
    this.props.initStudent(this.state.student)

    if (!this.props.navigate) {
      throw new Error("no navigate prop passed!")
    }
    void this.props.navigate(`/student/${id}`)
  }

  handleRawStudent = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    ev.preventDefault()

    let data = ev.currentTarget.value

    this.setState(() => ({ rawStudentText: data }))

    let parsedStudentText: PartialStudent
    try {
      // the SIS's export; convertStudent works with whatever it has
      parsedStudentText = JSON.parse(data) as PartialStudent
    } catch (error) {
      console.warn(error)
      // JSON.parse throws SyntaxErrors
      this.setState(() => ({ error: error as SyntaxError }))
      return
    }

    this.setState(
      () => ({ parsedStudentText }),
      () => {
        void this.handleImportData()
      },
    )
  }

  override render() {
    let { student, error, parsedStudentText } = this.state

    return (
      <>
        <Header>
          <h1>Import from the SIS</h1>
        </Header>

        <p>
          This is a <strong>Work-In-Progress</strong>. It may not work at all!
        </p>

        <hr />

        <p>
          To import your student data from St. Olaf's SIS, follow the following
          steps:
        </p>

        <ol>
          <li>
            Open{" "}
            <a
              href="https://www.stolaf.edu/sis/st-courses-json.cfm"
              target="_blank"
              rel="noopener noreferrer"
            >
              stolaf.edu/sis/st-courses-json.cfm
            </a>{" "}
            in a new tab
          </li>
          <li>Copy the text from the text box (all of it)</li>
          <li>Paste the text into the text box below</li>
        </ol>

        <textarea
          style={{ width: "100%", height: "100px" }}
          value={this.state.rawStudentText}
          onChange={this.handleRawStudent}
          placeholder="Paste the gibberish here"
        />

        {parsedStudentText && (
          <details>
            <summary>Parsed student data</summary>
            <pre>{JSON.stringify(parsedStudentText, null, 2)}</pre>
          </details>
        )}

        {error && (
          <details className="error-spot">
            <summary>
              <strong>{error.name}</strong>: {error.message}
            </summary>
            <pre className="error-stack">{error.stack}</pre>
          </details>
        )}

        {student && <StudentInfo student={student} />}

        {student && (
          <RaisedButton onClick={this.handleCreateStudent}>
            Import Student
          </RaisedButton>
        )}
      </>
    )
  }
}

const StudentInfo = ({ student }: Readonly<{ student: Student }>) => (
  <>
    <StudentSummary student={student} showEditor={false} showMessage={false} />

    <ul>
      {student.schedules
        .sortBy((s) => s.getTerm())
        .groupBy((s) => s.year)
        .map((schedules, year) => (
          <li key={year}>
            {year}:
            <ScheduleListing
              fabrications={student.fabrications}
              schedules={schedules}
            />
          </li>
        ))
        .toList()
        .toArray()}
    </ul>
  </>
)

const ScheduleListing = (
  props: Readonly<{
    schedules: Collection.Keyed<string, Schedule>
    fabrications: List<CourseType>
  }>,
) => {
  let { schedules, fabrications } = props

  return (
    <ul>
      {schedules
        .sortBy((s) => s.semester)
        .map((schedule) => (
          <li key={schedule.semester}>
            {semesterName(schedule.semester)}:
            <AbbreviatedCourseListing
              fabrications={fabrications}
              schedule={schedule}
            />
          </li>
        ))
        .toList()
        .toArray()}
    </ul>
  )
}

type ListingProps = { schedule: Schedule; fabrications: List<CourseType> }
type ListingState = { courses: List<Result<CourseType>> }

class AbbreviatedCourseListing extends React.Component<
  ListingProps,
  ListingState
> {
  override state: ListingState = { courses: List() }
  override componentDidMount() {
    void this.fetchCourses()
  }
  fetchCourses = async () => {
    let courses = await this.props.schedule.getCoursesWithErrors(
      getCourse,
      this.props.fabrications,
    )
    this.setState(() => ({ courses }))
  }
  override render() {
    let { courses } = this.state

    return (
      <ul>
        {courses
          .map((r, i) =>
            r.error ? (
              <li key={i}>{r.result.message}</li>
            ) : (
              <li key={r.result.clbid}>
                {r.result.department} {r.result.number}
                {r.result.section} – {r.result.name}
              </li>
            ),
          )
          .toArray()}
      </ul>
    )
  }
}

export default connector(SISImportScreen)

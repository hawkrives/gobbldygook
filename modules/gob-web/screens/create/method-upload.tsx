import * as React from "react"
import DropZone from "react-dropzone"
import type { Dispatch } from "redux"
import type { RouteComponentProps } from "@reach/router"
import { RaisedButton } from "../../components/button"
import List from "../../components/list"
import { StudentSummary } from "../../modules/student/student-summary"
import { action as initStudent } from "../../redux/students/actions/init-student"
import { connect, type ConnectedProps } from "react-redux"
import { Header } from "./components"
import { Student, type StudentInput } from "@gob/object-student"
import "./method-upload.scss"

type UploadedFile = {
  name: string
  size: number
  data: Promise<string>
}

type Converted =
  | ReturnType<typeof initStudent>
  | { name: string; error: string }

let mapDispatch = (dispatch: Dispatch) => ({ dispatch })

const connector = connect(undefined, mapDispatch)

type Props = RouteComponentProps & ConnectedProps<typeof connector>

type State = {
  files: Array<UploadedFile>
  actions: Array<Converted>
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

class UploadFileScreen extends React.Component<Props, State> {
  override state: State = {
    files: [],
    actions: [],
  }

  dropzone: DropZone | null = null

  handleFileDrop = (droppedFiles: Array<File>) => {
    console.log(droppedFiles)
    let files = droppedFiles.map((f) => ({
      name: f.name,
      size: f.size,
      data: new Promise<string>((resolve, reject) => {
        let reader = new FileReader()
        // readAsText always produces a string
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reader.onabort = reject
        reader.readAsText(f)
      }),
    }))
    this.setState(
      () => ({ files }),
      () => this.convertFilesToStudents(files),
    )
  }

  handleOpenPicker = () => {
    this.dropzone?.open()
  }

  convertOneFile = async (file: UploadedFile) => {
    let data = await file.data

    let parsed: StudentInput | { name: string; error: string }
    try {
      // an exported student; the Student constructor fills in what's missing
      parsed = JSON.parse(data) as StudentInput
    } catch (err) {
      const msg = errorMessage(err)
      parsed = {
        name: file.name,
        error: `could not parse "${data}" because "${msg}"`,
      }
    }

    let converted: Converted
    try {
      converted = initStudent(new Student(parsed))
    } catch (err) {
      converted = { name: file.name, error: errorMessage(err) }
    }

    this.setState((state) => ({ actions: [...state.actions, converted] }))
  }

  convertFilesToStudents = (files: Array<UploadedFile>) => {
    this.setState(
      () => ({ actions: [] }),
      () => files.forEach(this.convertOneFile),
    )
  }

  handleImportStudents = () => {
    this.state.actions.forEach((action) => {
      if ("type" in action) {
        this.props.dispatch(action)
      }
    })
    this.props.navigate?.("/")
  }

  override render() {
    let { actions } = this.state
    let files = this.state.files.slice(actions.length)

    return (
      <>
        <Header>
          <h1>Upload a File</h1>
        </Header>

        <DropZone
          ref={(el) => (this.dropzone = el)}
          accept=".gbstudent,.json,.gb-student"
          onDrop={this.handleFileDrop}
          multiple={true}
          className="upload-dropzone"
          activeClassName="canDrop"
          rejectClassName="canDrop" // HTML doesn't give us filenames until we drop, so it can't tell if it'll be accepted until the drop happens
        >
          <p>
            Just drop some students here, or click to select some to upload.
          </p>
        </DropZone>

        <List type="plain" className="upload-results">
          {actions.map((stu) =>
            "payload" in stu ? (
              <li key={stu.payload.id}>
                <StudentSummary
                  student={stu.payload}
                  showEditor={false}
                  showMessage={false}
                  showAvatar={false}
                  randomizeHello
                />
              </li>
            ) : (
              <li key={stu.name}>
                {stu.name} returned the error "{stu.error}"
              </li>
            ),
          )}
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </List>

        <div className="actions">
          <RaisedButton onClick={this.handleImportStudents}>
            Import Students
          </RaisedButton>
        </div>
      </>
    )
  }
}

export default connector(UploadFileScreen)

import * as React from "react"
import styled from "styled-components"
import { Card } from "../../components/card"
import { FlatButton } from "../../components/button"
import { Icon } from "../../components/icon"
import { Toolbar } from "../../components/toolbar"
import Modal from "../../components/modal"
import { close } from "../../icons/ionicons"
import { Student } from "@gob/object-student"

type Props = Readonly<{
  navigate: (to: string) => unknown
  student: Student
  queryString?: string
}>

type State = {
  encoded: string | undefined
  loading: boolean
}

const SizedCard = styled(Card)`
  width: 300px;
  min-height: 200px;

  margin: auto;
  padding: 1em;
`

export class ShareSheet extends React.Component<Props, State> {
  override state: State = {
    encoded: undefined,
    loading: true,
  }

  override componentDidMount() {
    void this.encodeStudent()
  }

  override componentDidUpdate(prevProps: Props) {
    if (this.props.student !== prevProps.student) {
      void this.encodeStudent()
    }
  }

  encodeStudent = async () => {
    this.setState(() => ({ loading: true }))
    // oxlint-disable-next-line typescript/await-thenable -- dataUrlEncode is synchronous now, but awaiting it keeps the loading state as its own render and a throw as a rejection
    let encoded = await this.props.student.dataUrlEncode()
    this.setState(() => ({ loading: false, encoded }))
  }

  override render() {
    let { student, navigate, queryString = window.location.search } = this.props
    let { encoded, loading } = this.state

    const boundCloseModal = () => {
      let params = new URLSearchParams(queryString)
      params.delete("share")
      navigate(`/student/${student.id}?${params.toString()}`)
    }

    return (
      <Modal onClose={boundCloseModal} contentLabel="Share">
        <SizedCard>
          <Toolbar>
            <FlatButton onClick={boundCloseModal}>
              <Icon>{close}</Icon>
            </FlatButton>
          </Toolbar>

          <p>
            {`Share "${student.name}":`}
            <br />
            {loading ? (
              <span>Preparing download…</span>
            ) : (
              <a download={`${student.name}.gbstudent`} href={encoded}>
                Download file
              </a>
            )}
          </p>
        </SizedCard>
      </Modal>
    )
  }
}

export default ShareSheet

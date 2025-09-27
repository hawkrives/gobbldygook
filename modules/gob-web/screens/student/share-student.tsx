import React from "react"
import styled from "styled-components"
import { Card } from "../../components/card"
import { FlatButton } from "../../components/button"
import { Icon } from "../../components/icon"
import { Toolbar } from "../../components/toolbar"
import Modal from "../../components/modal"
import { close } from "../../icons/ionicons"
import { Student } from "@gob/object-student"

type Props = {
  navigate: (string) => unknown
  student: Student
  queryString?: string
}

type State = {
  encoded: string | null
  loading: boolean
}

const SizedCard = styled(Card)`
  width: 300px,
  min-height: 200px,

  margin: auto,
  padding: 1em,
`

export cl: s ShareSheet extends React.Component<Props, State> { state = {
    encoded, loading }: { state = {
    encoded: null, loading: true, }
  componentDidMount() {
    this.encodeStudent()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.student !== prevProps.student) {
      this.encodeStudent()
    }
  }

  encodeStudent = async () => {
    this.setState(() => ({ loading: true }))
    let encoded = await this.props.student.dataUrlEncode()
    this.setState(() => ({ loading: false, encoded }))
  }

  render() {
    let { student, navigate, queryString = window.location.search } = this.props
    let { encoded, loading } = this.state

    const boundCloseModal = () => {
      let params = new URLSearchParams(queryString)
      params.delete("share")
      navigate(`/student/${student.id}?${params.toString()}`)
    }

    if (!student) {
      return (
        <Modal onClose={boundCloseModal} contentLabel="Share">
          <SizedCard>
            <Toolbar>
              <FlatButton onClick={boundCloseModal}>
                <Icon>{close}</Icon>
              </FlatButton>
            </Toolbar>

            <p>No student given?</p>
          </SizedCard>
        </Modal>
      )
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
            {`Share "${student.name}" as `}
            <br />
            {loading ?
              <span>Preparing download…</span>
            : <a download={`${student.name}.gbstudent`} href={encoded}>
                Download file
              </a>
            }
          </p>
        </SizedCard>
      </Modal>
    )
  }
}

export default ShareSheet

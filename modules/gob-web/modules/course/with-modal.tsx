import * as React from "react"
import { ModalCourse } from "./modal.tsx"
import CompactCourse from "./compact.tsx"
import type { Props as MiniProps } from "./compact.tsx"

type State = {
  isOpen: boolean
}

export type Props = MiniProps &
  Readonly<{
    scheduleId?: string | undefined
    studentId?: string | undefined
  }>

export default class CourseWithModal extends React.PureComponent<Props, State> {
  override state: State = {
    isOpen: false,
  }

  closeModal = () => {
    this.setState(() => ({ isOpen: false }))
  }
  openModal = () => {
    this.setState(() => ({ isOpen: true }))
  }

  override render() {
    return (
      <>
        <CompactCourse onClick={this.openModal} {...this.props} />
        {this.state.isOpen && (
          <ModalCourse onClose={this.closeModal} {...this.props} />
        )}
      </>
    )
  }
}

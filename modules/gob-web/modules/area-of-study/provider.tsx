import * as React from "react"
import type { EvaluationResult } from "@gob/examine-student"
import { Student, type AreaQuery } from "@gob/object-student"
import { checkStudentAgainstArea } from "../../workers/check-student"
import { loadArea } from "../../helpers/load-area"

type State = {
  examining: boolean
  results: EvaluationResult | null
  error: string | null
}

type Props = {
  areaOfStudy: AreaQuery
  student: Student
  children: (state: State) => React.ReactNode
}

export class AreaOfStudyProvider extends React.Component<Props, State> {
  override state: State = {
    examining: false,
    results: null,
    error: null,
  }

  override componentDidMount() {
    void this.startExamination()
  }

  override componentDidUpdate(prevProps: Props) {
    if (
      this.props.student !== prevProps.student ||
      this.props.areaOfStudy !== prevProps.areaOfStudy
    ) {
      void this.startExamination()
    }
  }

  startExamination = async () => {
    this.setState(() => ({ examining: true }))
    let area = await loadArea(this.props.areaOfStudy)

    if (area.error) {
      this.setState(() => ({ examining: false, error: area.message }))
      return
    }

    let results = await checkStudentAgainstArea(this.props.student, area.data)
    this.setState(() => ({ examining: false, results }))
  }

  override render() {
    let { examining, results, error } = this.state

    if (results?.error != null && results.error !== "") {
      error = results.error
    }

    return this.props.children({
      error,
      examining,
      results,
    })
  }
}

import * as React from "react"
import StudentPicker from "./student-picker.tsx"
import { connect } from "react-redux"
import { destroyStudent } from "../../redux/students/actions/destroy-student.ts"
import { loadStudents } from "../../redux/students/actions/load-students.ts"
import type { ConnectedProps } from "react-redux"
import type { RootState } from "../../redux/reducer.ts"
import type { SORT_BY_ENUM } from "./types.ts"

const connector = connect(
  (state: RootState) => ({ students: state.students }),
  { destroyStudent, loadStudents },
)

type Props = Readonly<ConnectedProps<typeof connector>>

type State = {
  filterText: string
  isEditing: boolean
  sortBy: SORT_BY_ENUM
  groupBy: "nothing"
}

const sortOptions: ReadonlyArray<SORT_BY_ENUM> = ["dateLastModified", "name"]

class StudentPickerContainer extends React.Component<Props, State> {
  override state: State = {
    filterText: "",
    isEditing: false,
    sortBy: "dateLastModified",
    groupBy: "nothing",
  }

  override componentDidMount() {
    this.props.loadStudents()
  }

  onFilterChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let searchText = ev.currentTarget.value || ""
    this.setState(() => ({ filterText: searchText.toLowerCase() }))
  }

  onGroupChange = () => {}

  onSortChange = () => {
    const currentIndex = sortOptions.indexOf(this.state.sortBy)
    const nextIndex = (currentIndex + 1) % sortOptions.length
    this.setState(() => ({ sortBy: sortOptions[nextIndex] ?? "name" }))
  }

  onToggleEditing = () => {
    this.setState(() => ({ isEditing: !this.state.isEditing }))
  }

  override render() {
    return (
      <StudentPicker
        destroyStudent={this.props.destroyStudent}
        filterText={this.state.filterText}
        groupBy={this.state.groupBy}
        isEditing={this.state.isEditing}
        onFilterChange={this.onFilterChange}
        onGroupChange={this.onGroupChange}
        onSortChange={this.onSortChange}
        onToggleEditing={this.onToggleEditing}
        sortBy={this.state.sortBy}
        students={this.props.students}
      />
    )
  }
}

export default connector(StudentPickerContainer)

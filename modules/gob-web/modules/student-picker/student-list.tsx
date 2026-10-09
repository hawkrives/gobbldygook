import fuzzysearch from "fuzzysearch"
import styled from "styled-components"
import { Card } from "../../components/card.ts"
import { PlainList } from "../../components/list.tsx"
import StudentListItem from "./student-list-item.tsx"
import type { SORT_BY_ENUM } from "./types.ts"
import { Map } from "immutable"
import type { State as StudentState } from "../../redux/students/reducers/index.ts"

const OuterCard = styled(Card)`
  max-width: 35em;
  width: 100%;
  margin: 0 auto 2em;
  overflow: hidden;
`

type Props = Readonly<{
  destroyStudent: (id: string) => unknown
  filter?: string
  groupBy: string
  isEditing: boolean
  sortBy: SORT_BY_ENUM
  students: StudentState
}>

export default function StudentList(props: Props) {
  let {
    isEditing,
    destroyStudent,
    students,
    filter: filterText = "",
    sortBy: sortByKey,
    // groupBy: groupByKey,
  } = props

  filterText = filterText.toLowerCase()
  let filtered = Map(students)
    .filter((s) =>
      fuzzysearch(filterText, (s.present.name || "").toLowerCase()),
    )
    .toList()
    .sortBy((s) => {
      switch (sortByKey) {
        case "name":
          return s.present.name
        case "dateLastModified":
          return s.present.dateLastModified
        default:
          throw new TypeError(`unknown sort key "${String(sortByKey)}"`)
      }
    })
    .map((student, i) => (
      <StudentListItem
        key={student.present.id || i}
        as="li"
        student={student}
        destroyStudent={destroyStudent}
        isEditing={isEditing}
      />
    ))

  if (sortByKey === "dateLastModified") {
    filtered = filtered.reverse()
  }

  return (
    <OuterCard>
      <PlainList>{[...filtered]}</PlainList>
    </OuterCard>
  )
}

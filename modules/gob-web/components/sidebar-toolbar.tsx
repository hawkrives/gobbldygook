import { Link } from "@reach/router"
import { connect } from "react-redux"
import { Card } from "./card.ts"
import { Icon } from "./icon.ts"
import { Toolbar, ToolbarButton } from "./toolbar.ts"
import { undo, redo } from "../redux/students/actions/undo.ts"
import {
  iosUndo,
  iosUndoOutline,
  iosRedo,
  iosRedoOutline,
  iosSearch,
  iosPeopleOutline,
  iosUploadOutline,
  grid,
} from "../icons/ionicons.tsx"
import styled from "styled-components"
import type { Student } from "@gob/object-student"
import type { Undoable } from "../types.ts"

type Props = Readonly<{
  redo: (studentId: string) => unknown
  student: Undoable<Student>
  undo: (studentId: string) => unknown

  search?: boolean
  share?: boolean
  backTo?: "picker" | "overview"
}>

const ToolsCard = styled(Card)`
  flex-shrink: 0;
  margin-bottom: 1em;
  position: sticky;
  top: 0;
  z-index: 1;
`

export function SidebarToolbar(props: Props) {
  const { undo, redo, search = true, share = true, backTo = "picker" } = props

  let student = props.student.present
  let studentId = student.id
  let canUndo = props.student.past.length > 0
  let canRedo = props.student.future.length > 0

  let toPicker = backTo === "picker"
  let toOverview = backTo === "overview"

  return (
    <ToolsCard>
      <Toolbar>
        {toPicker ? (
          <ToolbarButton as={Link} to="/" title="Students">
            <Icon block large>
              {iosPeopleOutline}
            </Icon>
          </ToolbarButton>
        ) : toOverview ? (
          <ToolbarButton as={Link} to={`/student/${studentId}`} title="Courses">
            <Icon block large>
              {grid}
            </Icon>
          </ToolbarButton>
        ) : (
          <div />
        )}

        {search ? (
          <ToolbarButton
            as={Link}
            to={`/student/${studentId}/search`}
            title="Search"
          >
            <Icon block large>
              {iosSearch}
            </Icon>
          </ToolbarButton>
        ) : (
          <div />
        )}

        <ToolbarButton
          title="Undo"
          onClick={() => undo(studentId)}
          disabled={!canUndo}
        >
          <Icon block large>
            {!canUndo ? iosUndoOutline : iosUndo}
          </Icon>
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          onClick={() => redo(studentId)}
          disabled={!canRedo}
        >
          <Icon block large>
            {!canRedo ? iosRedoOutline : iosRedo}
          </Icon>
        </ToolbarButton>

        {share ? (
          <ToolbarButton as={Link} to="?share" title="Share">
            <Icon block large>
              {iosUploadOutline}
            </Icon>
          </ToolbarButton>
        ) : (
          <div />
        )}
      </Toolbar>
    </ToolsCard>
  )
}

export const ConnectedSidebarToolbar = connect(undefined, { undo, redo })(
  SidebarToolbar,
)

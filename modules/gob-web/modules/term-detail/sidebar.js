// @flow

import * as React from 'react'
import cx from 'classnames'
import styled from 'styled-components'
import {Sidebar} from '../../components/sidebar'
import {PlainList} from '../../components/list'
import type {Undoable} from '../../types'
import {Student} from '@gob/object-student'
import {ConnectedSidebarToolbar} from '../../components/sidebar-toolbar'
import {Card} from '../../components/card'

let ScheduleListItem = styled.li`
	padding: 8px 12px;

	&.active {
		font-weight: bold;
	}
`

type RouterProps = {
	term?: string,
	uri?: string, // TODO: not actually optional
}

type ReactProps = {
	student: Undoable<Student>,
}

const TermSidebar = (props: RouterProps & ReactProps) => {
	let {student, term} = props

	let toolbar = (
		<ConnectedSidebarToolbar
			backTo="picker"
			search={false}
			share={true}
			student={student}
		/>
	)

	if (!term) {
		return <Sidebar>{toolbar}</Sidebar>
	}

	let year = parseInt(term.substr(0, 4), 10)
	let semester = parseInt(term.substr(4, 1), 10)

	let schedules = student.present.findSchedulesForTerm({year, semester})

	return (
		<Sidebar>
			{toolbar}

			<Card>
				<PlainList>
					{schedules.map(s => (
						<ScheduleListItem
							key={s.id}
							className={cx(s.active && 'active')}
						>
							{s.title} {s.active && '(active)'}
						</ScheduleListItem>
					))}
				</PlainList>
			</Card>
		</Sidebar>
	)
}

export default TermSidebar

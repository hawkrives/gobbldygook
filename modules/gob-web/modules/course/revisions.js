// @flow

import * as React from 'react'
import styled from 'styled-components'
import type {Course as CourseType} from '@gob/types'

type Props = {
	course: CourseType,
}

const RevisionTitle = styled.div`
	padding-top: 16px;
	font-weight: bold;
`

const Summary = styled.summary`
	outline-style: none;
`

export class Revisions extends React.Component<Props> {
	render() {
		const {course} = this.props

		if (!course.revisions) {
			return null
		}

		const revisions = [...course.revisions].reverse()

		const RevisionsList = revisions.map((items, index) => {
			let revisionDate = new Intl.DateTimeFormat('en-US').format(
				new Date(revisions[index]['_updated']),
			)

			return (
				<ul key={index}>
					<RevisionTitle>{revisionDate}</RevisionTitle>
					{Object.keys(items).map(
						key =>
							key !== '_updated' ? (
								<li key={key + index}>
									{key}: {items[key]}
								</li>
							) : null,
					)}
				</ul>
			)
		})

		return (
			<details>
				<Summary>Revisions</Summary>
				{RevisionsList}
			</details>
		)
	}
}

// @flow

import * as React from 'react'
import toPairs from 'lodash/toPairs'
import styled from 'styled-components'
import {BulletedList, ListItem} from '../../components/list'
import type {Course as CourseType} from '@gob/types'

type Props = {
	course: CourseType,
}

const RevisionTitle = styled.div`
	padding-top: 16px;
	font-weight: bold;
`

export class Revisions extends React.Component<Props> {
	render() {
		const {course} = this.props

		if (!course.revisions) {
			return null
		}

		const revisions = [...course.revisions].reverse()

		const RevisionsList = revisions.map((items, index) => {
			const revisionDate = new Intl.DateTimeFormat('en-US').format(
				new Date(items['_updated']),
			)

			return (
				<BulletedList key={index}>
					<RevisionTitle>{revisionDate}</RevisionTitle>
					{toPairs(items).map(
						([key, value]) =>
							key === 'offerings' ? null : key !== '_updated' ? (
								<ListItem key={key + index}>
									{key}: {value}
								</ListItem>
							) : null,
					)}
				</BulletedList>
			)
		})

		return (
			<details>
				<summary>Revisions</summary>
				{RevisionsList}
			</details>
		)
	}
}

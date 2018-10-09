// @flow

import * as React from 'react'
import toPairs from 'lodash/toPairs'
import styled from 'styled-components'
import {BulletedList, ListItem, IndentedListItem} from '../../components/list'
import type {Course as CourseType} from '@gob/types'

type Props = {
	course: CourseType,
}

const ListContainer = styled.div`
	margin-left: 36px;
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
				<ListContainer key={index}>
					<BulletedList>
						<ListItem>{revisionDate}</ListItem>
						{toPairs(items).map(
							([key, value]) =>
								key === 'offerings' ? null : key !==
								'_updated' ? (
									<IndentedListItem key={key + index}>
										{key}: {value}
									</IndentedListItem>
								) : null,
						)}
					</BulletedList>
				</ListContainer>
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

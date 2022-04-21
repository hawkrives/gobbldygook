// @flow

import * as React from 'react'
import toPairs from 'lodash/toPairs'
import styled from 'styled-components'
import type {Course as CourseType} from '@gob/types'

type Props = {
	course: CourseType,
}

const RevisionsTable = styled.table`
	border-collapse: collapse;
	border-style: hidden;
`

const TableHead = styled.thead``

const TableBody = styled.tbody``

const Head = styled.th`
	border: 1px solid black;
	padding: 7px;
	text-align: left;
`

const Row = styled.tr`
	border: 1px solid black;
`

const Data = styled.td`
	border: 1px solid black;
	padding: 7px;
	text-align: left;
`

const RevisionDate = styled.h2``

export class Revisions extends React.Component<Props> {
	render() {
		const {course} = this.props

		if (!course.revisions) {
			return null
		}

		const revisions = [...course.revisions].reverse()

		const Table = revisions.map((items, index) => {
			const revisionDate = new Intl.DateTimeFormat('en-US').format(
				new Date(items['_updated']),
			)

			return (
				<>
					<RevisionDate>{revisionDate}</RevisionDate>
					<RevisionsTable>
						<TableHead>
							<Row>
								<Head>Key</Head>
								<Head>Before</Head>
							</Row>
						</TableHead>
						{toPairs(items).map(([key, value]) =>
							key === 'offerings' ? null : key !== '_updated' ? (
								<TableBody key={key + index}>
									<Row>
										<Data>{key}</Data>
										<Data>{value}</Data>
									</Row>
								</TableBody>
							) : null,
						)}
					</RevisionsTable>
				</>
			)
		})

		return (
			<details>
				<summary>Revisions</summary>
				{Table}
			</details>
		)
	}
}

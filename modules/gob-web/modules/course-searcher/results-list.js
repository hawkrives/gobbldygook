// @flow

import * as React from 'react'
import {VariableSizeList} from 'react-window'
import {List} from 'immutable'
import {Card} from '../../components/card'
import AutoSizer from 'react-virtualized-auto-sizer'
import {DraggableCourse} from '../course'
import styled from 'styled-components'
import {type Course as CourseType} from '@gob/types'
import type {GROUP_BY_KEY} from './constants'
import {Student} from '@gob/object-student'

type Results = List<string | CourseType>

type Props = {
	groupedBy: GROUP_BY_KEY,
	results: Results,
	student?: Student,
}

const TermList = styled(VariableSizeList)`
	margin: 0;
	padding: 0;
	list-style: none;
`

const ResultsListSizer = styled(Card)`
	flex: 1;

	// for AutoSizer (react-virtualized):
	// > If the parent has style 'position: static' (default value), it changes to
	// > position: relative. It also injects a sibling div for size measuring.
	position: relative;

	overflow: hidden;
`

const CourseGroupTitle = styled.h3`
	margin: 0;
	font-size: 1em;
	font-weight: 400;

	padding: 0 0.5em;

	display: flex;
	align-items: center;
	& > span {
		text-align: center;
		flex: 1;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`

const CourseListItem = styled(DraggableCourse)`
	padding: 0 0.5em;

	display: flex;
	flex-direction: column;
	justify-content: center;
`

function getRowHeight(item: string | CourseType) {
	if (typeof item === 'string') {
		// heading
		return 65
	}

	let firstRowHeight = 20
	let subtitleHeight = 15
	let rowHeight = 16
	let verticalPadding = 4

	let height = firstRowHeight + rowHeight

	let hasTimes = item.offerings && item.offerings.length
	let hasSubtitle =
		item.name &&
		item.title &&
		(item.type === 'Seminar' || item.type === 'Topic')

	if (hasTimes) {
		height += rowHeight
	}

	if (hasSubtitle) {
		height += subtitleHeight
	}

	return height + verticalPadding * 2
}

export class CourseResultsList extends React.Component<Props> {
	getRowHeight = (index: number) => {
		let item = this.props.results.get(index)

		if (!item) {
			return null
		}

		return getRowHeight(item)
	}

	renderHeader = (title: string, {style}: {style: Object}) => {
		if (!title) {
			return null
		}

		return (
			<CourseGroupTitle style={style} title={title}>
				<span>{title}</span>
			</CourseGroupTitle>
		)
	}

	renderRow = (args: {index: number, style: Object}) => {
		let {index, style} = args
		let item = this.props.results.get(index)

		if (!item) {
			return null
		}

		if (typeof item === 'string') {
			return this.renderHeader(item, {style})
		}

		let {student} = this.props

		return <CourseListItem style={style} course={item} student={student} />
	}

	render() {
		return (
			<ResultsListSizer className="course-search--results_sizer">
				<AutoSizer>
					{({height, width}) => (
						<TermList
							height={height}
							itemCount={this.props.results.size}
							itemSize={this.getRowHeight}
							width={width}
						>
							{this.renderRow}
						</TermList>
					)}
				</AutoSizer>
			</ResultsListSizer>
		)
	}
}

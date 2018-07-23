// @flow
import * as React from 'react'
import sumBy from 'lodash/sumBy'
import {List, AutoSizer} from 'react-virtualized'
import {DraggableCourse} from '../course'
import {
	toPrettyTerm,
	expandYear,
	semesterName,
} from '@gob/school-st-olaf-college'

const GROUP_BY_TO_TITLE = {
	'Day of Week': days => days,
	Department: depts => depts,
	GenEd: gereqs => gereqs,
	Semester: sem => semesterName(sem),
	Term: term => toPrettyTerm(term),
	'Time of Day': times => times,
	Year: year => expandYear(year),
	None: () => '',
}

type Props = {
	groupBy: string,
	results: Array<[string, Array<any>]>,
	sortBy?: string,
	studentId?: string,
}

type State = {
	itemCount: number,
}

export default class CourseResultsList extends React.Component<Props, State> {
	state = {itemCount: 0}

	static getDerivedStateFromProps = (props: Props) => {
		// add 1 for the section heading
		let itemCount = sumBy(props.results, ([_, items]) => items.length + 1)
		return {itemCount}
	}

	// method borrowed from https://github.com/lucasferreira/react-virtualized-sectionlist/blob/1ed9437c76dbc9b3fcf01dd9c5b50c96d9dc211c/source/index.js#L100-L123
	extractItemAtIndex = (
		index: number,
	): {
		title: ?string,
		items: Array<any>,
		itemIndex: ?number,
		sectionIndex: ?number,
		isHeader: boolean,
	} => {
		let itemIndex = index

		for (let i = 0; i < this.props.results.length; i++) {
			let [title, items] = this.props.results[i]

			// The section adds an item for the header
			itemIndex -= 1

			if (itemIndex >= items.length) {
				itemIndex -= items.length
				continue
			}

			let isHeader = itemIndex === -1

			return {
				title,
				items,
				itemIndex: isHeader ? null : itemIndex,
				sectionIndex: i,
				isHeader: isHeader,
			}
		}

		return {
			title: null,
			items: [],
			itemIndex: null,
			sectionIndex: null,
			isHeader: false,
		}
	}

	getRowHeight = ({index}: {|index: number|}) => {
		let {isHeader, itemIndex, items} = this.extractItemAtIndex(index)

		if (isHeader) {
			return 35
		}

		if (itemIndex == null || !items[itemIndex]) {
			return 0
		}

		let course = items[itemIndex]
		let courseRows = 2

		let hasTimes = course.times && course.times.length
		let hasSubtitle =
			course.name &&
			course.title &&
			(course.type === 'Seminar' || course.type === 'Topic')

		if (hasTimes) {
			courseRows += 1
		}
		if (hasSubtitle) {
			courseRows += 1
		}

		if (courseRows === 2) {
			return 38
		} else if (courseRows === 3) {
			return 56
		} else if (courseRows === 4) {
			return 71
		}

		return 0
	}

	renderHeader = (args: {title: ?string, key: string, style: any}) => {
		let {title: groupTitle, key, style} = args
		if (!groupTitle) {
			return null
		}

		const title = GROUP_BY_TO_TITLE[this.props.groupBy](groupTitle)
		return (
			<div style={style} key={key} className="course-group-title">
				{title}
			</div>
		)
	}

	renderRow = (args: {index: number, style: Object, key: string}) => {
		let {index, style, key} = args
		let {isHeader, itemIndex, items, title} = this.extractItemAtIndex(index)

		if (isHeader) {
			return this.renderHeader({title, key, style})
		}

		if (itemIndex == null || !items[itemIndex]) {
			return null
		}

		let course = items[itemIndex]

		return (
			<DraggableCourse
				key={key}
				style={style}
				course={course}
				studentId={this.props.studentId}
			/>
		)
	}

	render() {
		return (
			<AutoSizer>
				{({height, width}) => (
					<List
						className="term-list"
						height={height}
						rowCount={this.state.itemCount}
						rowHeight={this.getRowHeight}
						rowRenderer={this.renderRow}
						width={width}
					/>
				)}
			</AutoSizer>
		)
	}

	renderAllAtOnce = () => {
		const {results, groupBy: groupByValue, studentId} = this.props

		return (
			<ul className="term-list">
				{results.map(([groupTitle, courses]) => {
					const title = GROUP_BY_TO_TITLE[groupByValue](groupTitle)
					return (
						<li key={groupTitle} className="course-group">
							{title && (
								<p className="course-group-title">{title}</p>
							)}
							<ul className="course-list">
								{courses.map((course, index) => (
									<li key={index}>
										<DraggableCourse
											course={course}
											studentId={studentId}
										/>
									</li>
								))}
							</ul>
						</li>
					)
				})}
			</ul>
		)
	}
}

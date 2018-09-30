// @flow

import * as React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import CourseSearcher from './course-searcher'
import type {Course as CourseType} from '@gob/types'

import {
	groupResults,
	sortResults,
	submitQuery,
	updateQuery,
	setPartialQuery,
} from './redux/actions'
import {GROUP_BY, SORT_BY} from './course-searcher-options'

type Props = {
	closeSearcher: Function,
	groupResults: Function, // redux
	search: {
		error: ?string,
		groupBy: $Keys<typeof GROUP_BY>,
		hasQueried: boolean,
		inProgress: boolean,
		query: string,
		results: Array<string | CourseType>,
		sortBy: $Keys<typeof SORT_BY>,
	}, // redux
	setPartialQuery: Function,
	sortResults: Function, // redux
	studentId?: string,
	submitQuery: Function, // redux
	term?: number,
	updateQuery: Function, // redux
}

type State = {}

export class CourseSearcherContainer extends React.Component<Props, State> {
	state = {}

	handleQuerySubmit = () => {
		this.props.setPartialQuery({term: this.props.term})
		this.props.submitQuery()
	}

	handleQueryChange = (ev: SyntheticKeyboardEvent<HTMLInputElement>) => {
		this.props.updateQuery(ev.currentTarget.value)
	}

	handleKeyDown = (ev: SyntheticKeyboardEvent<HTMLInputElement>) => {
		if (ev.keyCode === 13) {
			this.handleQuerySubmit()
		}
	}

	handleSortChange = (ev: SyntheticEvent<HTMLSelectElement>) => {
		this.props.sortResults(ev.currentTarget.value)
	}

	handleGroupByChange = (ev: SyntheticEvent<HTMLSelectElement>) => {
		this.props.groupResults(ev.currentTarget.value)
	}

	render() {
		return (
			<CourseSearcher
				error={this.props.search.error}
				groupBy={this.props.search.groupBy}
				hasQueried={this.props.search.hasQueried}
				inProgress={this.props.search.inProgress}
				onCloseSearcher={this.props.closeSearcher}
				onGroupByChange={this.handleGroupByChange}
				onKeyDown={this.handleKeyDown}
				onQueryChange={this.handleQueryChange}
				onQuerySubmit={this.handleQuerySubmit}
				onSortChange={this.handleSortChange}
				partial={this.props.term ? {term: this.props.term} : null}
				query={this.props.search.query}
				results={this.props.search.results}
				sortBy={this.props.search.sortBy}
				studentId={this.props.studentId}
			/>
		)
	}
}

const mapStateToProps = state => ({
	search: state.search,
})

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			groupResults,
			sortResults,
			submitQuery,
			updateQuery,
			setPartialQuery,
		},
		dispatch,
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CourseSearcherContainer)

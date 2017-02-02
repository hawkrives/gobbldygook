import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compareProps } from '../../lib'
import CourseSearcher from './course-searcher'

import { groupResults, sortResults, submitQuery, updateQuery, setPartialQuery } from './search/actions'

export class CourseSearcherContainer extends Component {
	static propTypes = {
		closeSearcher: PropTypes.func.isRequired,
		groupResults: PropTypes.func.isRequired,  // redux
		partial: PropTypes.shape({ year: PropTypes.number, semester: PropTypes.number }),
		search: PropTypes.shape({
			error: PropTypes.any.isRequired,
			groupBy: PropTypes.string.isRequired,
			hasQueried: PropTypes.bool.isRequired,
			inProgress: PropTypes.bool.isRequired,
			query: PropTypes.string.isRequired,
			results: PropTypes.array.isRequired,
			sortBy: PropTypes.string.isRequired,
		}).isRequired,  // redux
		setPartialQuery: PropTypes.func.isRequired,
		sortResults: PropTypes.func.isRequired,  // redux
		studentId: PropTypes.string,
		submitQuery: PropTypes.func.isRequired,  // redux
		updateQuery: PropTypes.func.isRequired,  // redux
	};

	shouldComponentUpdate(nextProps, nextState) {
		return compareProps(this.props, nextProps) || compareProps(this.state !== nextState)
	}

	handleQuerySubmit = () => {
		this.props.setPartialQuery(this.props.partial)
		this.props.submitQuery()
	};

	handleQueryChange = ev => {
		this.props.updateQuery(ev.target.value)
	};

	handleKeyDown = ev => {
		if (ev.keyCode === 13) {
			this.handleQuerySubmit()
		}
	};

	handleSortChange = ev => {
		this.props.sortResults(ev.target.value)
	};

	handleGroupByChange = ev => {
		this.props.groupResults(ev.target.value)
	};

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
				partial={this.props.partial}
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
	bindActionCreators({ groupResults, sortResults, submitQuery, updateQuery, setPartialQuery }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CourseSearcherContainer)

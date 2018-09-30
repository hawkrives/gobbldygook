// @flow

import * as React from 'react'
import type {Course as CourseType} from '@gob/types'
import {queryCourseDatabase} from '../../helpers/query-course-database'
import present from 'present'
import mem from 'mem'
import prettyMs from 'pretty-ms'
import {sortAndGroup} from './lib'
import {ga} from '../../analytics'
import type {GROUP_BY_KEY, SORT_BY_KEY} from './constants'

type Props = {
	query: string,
	term?: ?number,
	children: ({
		error: ?string,
		inProgress: boolean,
		results: Array<string | CourseType>,
	}) => React.Node,
	groupBy: GROUP_BY_KEY,
	sortBy: SORT_BY_KEY,
}

type State = {|
	error: ?string,
	inProgress: boolean,
	results: Array<CourseType>,
	grouped: Array<string | CourseType>,
|}

const memSortAndGroup = mem(sortAndGroup, {maxAge: 10000})

export class Querier extends React.Component<Props, State> {
	state = {
		error: '',
		inProgress: false,
		results: [],
		grouped: [],
	}

	_isMounted: boolean = false

	componentDidMount() {
		this._isMounted = true

		let props = this.props
		if (props.query || props.term) {
			this.submitQuery(props.query, {term: props.term})
		}
	}

	didComponentUpdate(prevProps: Props) {
		let props = this.props
		if (prevProps.query !== props.query || prevProps.term !== props.term) {
			this.submitQuery(props.query, {term: props.term})
		}
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	submitQuery = async (query: string, {term}: {term: ?number}) => {
		if (!query && term == null) {
			return
		}

		ga('send', 'event', 'search_query', 'submit', query, 1)

		const startQueryTime = present()

		this.setState(() => ({inProgress: true}))

		try {
			console.log(query, {term})
			const payload = await queryCourseDatabase(query, {term})
			console.info(`query took ${prettyMs(present() - startQueryTime)}.`)

			if (!this._isMounted) {
				return
			}

			this.setState(() => ({inProgress: false, results: payload}))
		} catch (error) {
			if (!this._isMounted) {
				return
			}
			this.setState(() => ({inProgress: false, error: error.message}))
		}
	}

	render() {
		let {error, inProgress, results} = this.state
		let {sortBy: sorting, groupBy: grouping} = this.props
		let grouped = memSortAndGroup(results, {sorting, grouping})

		return this.props.children({error, inProgress, results: grouped})
	}
}

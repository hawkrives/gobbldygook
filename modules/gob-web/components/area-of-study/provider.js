// @flow

import * as React from 'react'

import {db} from '../../helpers/db'
import {type ParsedHansonFile} from '@gob/hanson-format'

type Props = {
	children: ({
		loading: boolean,
		areas: Array<ParsedHansonFile>,
	}) => React.Node,
}

type State = {
	loading: boolean,
	areas: Array<ParsedHansonFile>,
}

export class AreaOfStudyProvider extends React.PureComponent<Props, State> {
	state = {
		areas: [],
		loading: true,
	}

	componentDidMount() {
		this.cacheAreas()
	}

	cacheAreas = async () => {
		let areas = await db.store('areas').getAll()

		this.setState(() => ({areas, loading: false}))
	}

	render() {
		let {areas, loading} = this.state
		return this.props.children({areas, loading})
	}
}

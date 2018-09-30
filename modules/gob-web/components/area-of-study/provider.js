// @flow

import * as React from 'react'

import {db} from '../../helpers/db'
import {type AreaOfStudyType} from '@gob/object-student'

type Props = {
	children: ({loading: boolean, areas: Array<AreaOfStudyType>}) => React.Node,
}

type State = {
	loading: boolean,
	areas: Array<AreaOfStudyType>,
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

import React, {Component, PropTypes} from 'react'
import filter from 'lodash/collection/filter'
import keys from 'lodash/object/keys'

import isRequirementName from '../lib/is-requirement-name'

import Expression from './expression'
import Button from './button'

export default class Requirement extends Component {
	static propTypes = {
		addOverride: PropTypes.func.isRequired,
		computed: PropTypes.bool,
		filter: PropTypes.object,
		message: PropTypes.string,
		name: PropTypes.string,
		path: PropTypes.array,
		result: PropTypes.object,
		topLevel: PropTypes.bool,
	}

	static defaultProps = {
		topLevel: false,
	}

	render() {
		const childKeys = filter(keys(this.props), isRequirementName)

		const result = this.props.result
			? <div className='requirement--result'><Expression expr={this.props.result} ctx={this.props} /></div>
			: null

		const message = this.props.message
			? <p className='requirement--message'>{this.props.message}</p>
			: null

		const filterEl = this.props.filter
			? <div className='requirement--filter'>Filter: {JSON.stringify(this.props.filter, null, 2)}</div>
			: null

		const wasComputed = this.props.hasOwnProperty('computed')
		const computationResult = this.props.computed

		const title = this.props.topLevel
			? null
			: <h2 className={`requirement--title ${wasComputed ? computationResult ? 'computed-success' : 'computed-failure' : 'computed-not'}`}>{this.props.name}</h2>

		const children = childKeys.map(key => <Requirement key={key} name={key} {...this.props[key]} path={this.props.path.concat(key)} addOverride={this.props.addOverride} />)

		let override = (this.props.message && !this.props.result)
			? (
				<span className='requirement--override-buttons button-group'>
					<Button type='flat'>Not yet…</Button>
					<Button onClick={ev => this.props.addOverride({ev, path: this.props.path})} type='flat'>Done!</Button>
				</span>
			)
			: null

		return (
			<div className={`requirement`}>
				{title}
				{message}
				{override}
				{filterEl}
				{result}
				{children.length ? <div className='children'>{children}</div> : null}
			</div>
		)
	}
}

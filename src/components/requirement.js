import React, {Component, PropTypes} from 'react'
import filter from 'lodash/collection/filter'
import keys from 'lodash/object/keys'
import map from 'lodash/collection/map'
import sortBy from 'lodash/collection/sortBy'
import cx from 'classnames'

import isRequirementName from '../lib/is-requirement-name'

import Expression from './expression'
import Button from './button'

import './requirement.scss'

function getResultOfRequirement(requirements) {
	return requirementTitle => requirements[requirementTitle].computed ? 'A' : 'B'
}

export default class Requirement extends Component {
	static propTypes = {
		addOverride: PropTypes.func.isRequired,
		computed: PropTypes.bool,
		filter: PropTypes.object,
		message: PropTypes.string,
		name: PropTypes.string,
		overridden: PropTypes.bool,
		path: PropTypes.array.isRequired,
		removeOverride: PropTypes.func.isRequired,
		result: PropTypes.object,
		toggleOverride: PropTypes.func.isRequired,
		topLevel: PropTypes.bool,
	}

	static defaultProps = {
		topLevel: false,
	}

	render() {
		const childKeys = filter(keys(this.props), isRequirementName)

		const extraClasses = {overridden: this.props.overridden}
		if (this.props.result && this.props.result.$type === 'course') {
			extraClasses['compact-results'] = true
		}

		const result = this.props.result &&
			<div className='requirement--result'><Expression expr={this.props.result} ctx={this.props} /></div>

		const message = this.props.message &&
			<p className='requirement--message'>{this.props.message}</p>

		const filterEl = this.props.filter &&
			<div className='requirement--filter'>Filter: {JSON.stringify(this.props.filter, null, 2)}</div>

		const wasComputed = this.props.hasOwnProperty('computed')
		const computationResult = this.props.computed

		const title = !(this.props.topLevel) && (
			<h2 className={`requirement--heading ${wasComputed ? computationResult ? 'computed-success' : 'computed-failure' : 'computed-not'}`} title={this.props.name}>
				<span className='requirement--title'>
					<span className='requirement--title-status'>{this.props.computed ? '●' : '○'}</span>
					{` ${this.props.name}`}
					{this.props.overridden && <span className='requirement--title-override-text'>{' (Overridden)'}</span>}
				</span>
				<Button className='requirement--override-button'
					onClick={ev => this.props.toggleOverride({ev, path: this.props.path})}
					title={this.props.overridden ? `Remove Override` : `Apply Override`}>
					{`${this.props.overridden ? '◉' : '◎'}`}
				</Button>
			</h2>
		)

		const children = map(sortBy(childKeys, getResultOfRequirement(this.props)), key =>
			<Requirement key={key}
				name={key}
				{...this.props[key]}
				path={this.props.path.concat(key)}
				addOverride={this.props.addOverride}
				toggleOverride={this.props.toggleOverride}
				removeOverride={this.props.removeOverride}
			/>)

		let override = (this.props.message && !this.props.result) && (
			<span className='requirement--override-buttons button-group'>
				<Button onClick={ev => this.props.removeOverride({ev, path: this.props.path})} type='flat'>Not yet…</Button>
				<Button onClick={ev => this.props.addOverride({ev, path: this.props.path})} type='flat'>Done!</Button>
			</span>
		)

		return (
			<div className={cx(`requirement`, extraClasses)}>
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

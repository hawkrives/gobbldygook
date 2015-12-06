import React, {Component, PropTypes} from 'react'
import filter from 'lodash/collection/filter'
import keys from 'lodash/object/keys'
import map from 'lodash/collection/map'
import sortBy from 'lodash/collection/sortBy'
import cx from 'classnames'

import isRequirementName from '../area-tools/is-requirement-name'

import Filter from './expression--filter'
import Expression from './expression'
import Button from './button'

import compareProps from '../helpers/compare-props'
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

	shouldComponentUpdate(nextProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		const childKeys = filter(keys(this.props), isRequirementName)

		const wasComputed = this.props.hasOwnProperty('computed')
		const computationResult = this.props.computed
		const computationClassName = wasComputed ? computationResult ? 'computed-success' : 'computed-failure' : 'computed-not'

		const extraClasses = {
			overridden: this.props.overridden,
		}

		const compactMode = (
			!this.props.message &&
			!this.props.filter &&
			this.props.result &&
			this.props.result.$type === 'course'
		)
		if (compactMode) {
			extraClasses['compact-results'] = true
		}

		const result = this.props.result && (
			<div className='requirement--result'>
				<Expression expr={this.props.result} ctx={this.props} />
			</div>
		)

		const message = this.props.message &&
			<p className='requirement--message'>{this.props.message}</p>

		const filterEl = this.props.filter && (
			<div className='requirement--filter'>
				Filter:
				<Filter expr={this.props.filter} ctx={this.props} />
			</div>
		)

		const title = !(this.props.topLevel) && (
			<h2 className='requirement--heading' title={this.props.name}>
				<Button className='requirement--override-button'
					onClick={ev => this.props.toggleOverride({ev, path: this.props.path})}
					title={this.props.overridden ? `Remove Override` : `Apply Override`}>
					{`${this.props.overridden ? '◉' : '◎'}`}
				</Button>
				<span className='requirement--title'>
					{` ${this.props.name}`}
					{!compactMode && <span className='requirement--status'>{this.props.computed ? '●' : '○'}</span>}
				</span>
				{this.props.overridden && <span className='requirement--title-override-text'>{' (Overridden)'}</span>}
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

		const override = (this.props.message && !this.props.result) && (
			<span className='requirement--override-buttons button-group'>
				<Button onClick={ev => this.props.removeOverride({ev, path: this.props.path})} type='flat'>Not yet…</Button>
				<Button onClick={ev => this.props.addOverride({ev, path: this.props.path})} type='flat'>Done!</Button>
			</span>
		)

		return (
			<div className={cx(`requirement`, extraClasses, computationClassName)}>
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

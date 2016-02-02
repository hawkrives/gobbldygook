import React, {PropTypes} from 'react'
import filter from 'lodash/filter'
import keys from 'lodash/keys'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import cx from 'classnames'

import isRequirementName from '../../../area-tools/is-requirement-name'

import Filter from './expression--filter'
import Expression from './expression'
import Button from '../../../components/button'

import './requirement.scss'

function getResultOfRequirement(requirements) {
	return requirementTitle => requirements[requirementTitle].computed ? 'A' : 'B'
}

export default function Requirement(props) {
	const {
		topLevel = false,
	} = props
	const childKeys = filter(keys(props), isRequirementName)

	const wasComputed = props.hasOwnProperty('computed')
	const computationResult = props.computed
	const computationClassName = wasComputed ? computationResult ? 'computed-success' : 'computed-failure' : 'computed-not'

	const extraClasses = {
		overridden: props.overridden,
	}

	const compactMode = (
		!props.message &&
		!props.filter &&
		props.result &&
		props.result.$type === 'course'
	)
	if (compactMode) {
		extraClasses['compact-results'] = true
	}

	const result = props.result && (
		<div className='requirement--result'>
			<Expression expr={props.result} ctx={props} />
		</div>
	)

	const message = props.message &&
		<p className='requirement--message'>{props.message}</p>
	const description = props.description &&
		<p className='requirement--description'>{props.description}</p>

	const filterEl = props.filter && (
		<div className='requirement--filter'>
			Filter:
			<Filter expr={props.filter} ctx={props} />
		</div>
	)

	const title = !topLevel && (
		<h2 className='requirement--heading' title={props.name}>
			<Button className='requirement--override-button'
				onClick={ev => props.onToggleOverride(props.path, ev)}
				title={props.overridden ? `Remove Override` : `Apply Override`}>
				{`${props.overridden ? '◉' : '◎'}`}
			</Button>
			<span className='requirement--title'>
				{` ${props.name}`}
				{!compactMode && <span className='requirement--status'>{props.computed ? '●' : '○'}</span>}
			</span>
			{props.overridden && <span className='requirement--title-override-text'>{' (Overridden)'}</span>}
		</h2>
	)

	const children = map(sortBy(childKeys, getResultOfRequirement(props)), key =>
		<Requirement key={key}
			name={key}
			{...props[key]}
			path={props.path.concat(key)}
			onAddOverride={props.onAddOverride}
			onToggleOverride={props.onToggleOverride}
			onRemoveOverride={props.onRemoveOverride}
		/>)

	const override = (props.message && !props.result) && (
		<span className='requirement--override-buttons button-group'>
			<Button onClick={ev => props.onRemoveOverride(props.path, ev)} type='flat'>Not yet…</Button>
			<Button onClick={ev => props.onAddOverride(props.path, ev)} type='flat'>Done!</Button>
		</span>
	)

	return (
		<div className={cx(`requirement`, extraClasses, computationClassName)}>
			{title}
			{description}
			{message}
			{override}
			{filterEl}
			{result}
			{children.length ? <div className='children'>{children}</div> : null}
		</div>
	)
}
Requirement.propTypes = {
	computed: PropTypes.bool,
	description: PropTypes.string,
	filter: PropTypes.object,
	message: PropTypes.string,
	name: PropTypes.string,
	onAddOverride: PropTypes.func.isRequired,
	onRemoveOverride: PropTypes.func.isRequired,
	onToggleOverride: PropTypes.func.isRequired,
	overridden: PropTypes.bool,
	path: PropTypes.array.isRequired,
	result: PropTypes.object,
	topLevel: PropTypes.bool,
}

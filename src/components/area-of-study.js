import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import Button from './button'
import Icon from './icon'
import Requirement from './requirement'
import ProgressBar from './progress-bar'

import './area-of-study.scss'

export default class AreaOfStudy extends Component {
	static propTypes = {
		addOverride: PropTypes.func.isRequired,
		area: PropTypes.shape({
			_checked: PropTypes.bool,
			_error: PropTypes.string,
			_progress: PropTypes.shape({
				at: PropTypes.number.isRequired,
				of: PropTypes.number.isRequired,
			}),
			data: PropTypes.object,
			isCustom: PropTypes.bool,
			name: PropTypes.string.isRequired,
			result: PropTypes.object,
			revision: PropTypes.string.isRequired,
			slug: PropTypes.string,
			type: PropTypes.string.isRequired,
		}).isRequired,
		removeArea: PropTypes.func.isRequired,
		removeOverride: PropTypes.func.isRequired,
		showCloseButton: PropTypes.bool.isRequired,
		showEditButton: PropTypes.bool.isRequired,
		studentId: PropTypes.string.isRequired,
		toggleOverride: PropTypes.func.isRequired,
	}

	static defaultProps = {
		_progress: {
			word: 'zero',
			at: 0,
			of: 1,
		},
		_error: '',
		_checked: false,
		name: 'Unknown Area',
		type: '???',
		revision: '0000-00',
		result: {},
	}

	constructor() {
		super()
		this.state = {
			open: false,
			confirmRemoval: false,
		}
	}

	startRemovalConfirmation = ev => {
		ev.preventDefault()
		this.setState({confirmRemoval: true})
	}

	endRemovalConfirmation = ev => {
		ev.preventDefault()
		this.setState({confirmRemoval: false})
	}

	render() {
		const { area } = this.props
		const { type, revision, slug, isCustom, name, _progress: progress, _error: error, _checked: checked } = area

		const summary = (
			<div>
				<div className='area--summary-row'>
					<h1 className='area--title'>
						{slug && !isCustom && this.state.open
							? <a className='catalog-link'
								href={`http://catalog.stolaf.edu/academic-programs/${slug}/`}
								target='_blank'
								onClick={ev => ev.stopPropagation()}
								title='View in the St. Olaf Catalog'
							>
								{name}
							</a>
							: name}
					</h1>
					<span className='icons'>
						{this.props.showCloseButton &&
						<Button className='area--remove-button' onClick={this.startRemovalConfirmation}>
							<Icon name='close' />
						</Button>}
						<Icon
							className='area--open-indicator'
							name={this.state.open ? 'chevron-up' : 'chevron-down'}
						/>
					</span>
				</div>
				<ProgressBar
					className={cx('area--progress', {error: error})}
					colorful={true}
					value={progress.at}
					max={progress.of}
				/>
			</div>
		)

		const removalConfirmation = (
			<div className='area--confirm-removal'>
				<p>Remove <strong>{name}</strong>?</p>
				<span className='button-group'>
					<Button
						className='area--actually-remove-area'
						onClick={ev => this.props.removeArea({ev, areaQuery: {name, type, revision}})}
					>
						Remove
					</Button>
					<Button onClick={this.endRemovalConfirmation}>Cancel</Button>
				</span>
			</div>
		)

		let contents = null
		if (error) {
			contents = <p className='area--error'>{error} {':('}</p>
		}
		else if (!checked) {
			contents = <p className='area--loading'>Loading…</p>
		}
		else {
			contents = (
				<Requirement
					{...this.props}
					topLevel
					addOverride={this.props.addOverride}
					toggleOverride={this.props.toggleOverride}
					removeOverride={this.props.removeOverride}
					path={[type, name]}
				/>
			)
		}

		return (
			<details className={cx('area', {errored: Boolean(error)}, {loading: !checked})}>
				<summary
					className='area--summary'
					onClick={() => this.setState(state => ({open: !state.open}))}
				>
					{this.state.confirmRemoval
						? removalConfirmation
						: summary}
				</summary>
				{this.state.open && !this.state.confirmRemoval && contents}
			</details>
		)
	}
}

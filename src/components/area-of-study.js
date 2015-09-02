import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import Button from './button'
import Icon from './icon'
import Requirement from './requirement'
import ProgressBar from './progress-bar'

import './area-of-study.scss'

export default class AreaOfStudy extends Component {
	static propTypes = {
		_error: PropTypes.string,
		_progress: PropTypes.shape({
			at: PropTypes.number.isRequired,
			of: PropTypes.number.isRequired,
		}),
		addOverride: PropTypes.func.isRequired,
		data: PropTypes.object,
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		removeArea: PropTypes.func.isRequired,
		removeOverride: PropTypes.func.isRequired,
		result: PropTypes.object.isRequired,
		revision: PropTypes.string.isRequired,
		showCloseButton: PropTypes.bool.isRequired,
		slug: PropTypes.string.isRequired,
		toggleOverride: PropTypes.func.isRequired,
		type: PropTypes.string.isRequired,
	}

	static defaultProps = {
		_progress: {
			word: 'zero',
			at: 0,
			of: 1,
		},
		_error: '',
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
		const summary = (
			<div>
				<div className='area--summary-row'>
					<h1 className='area--title'>{this.props.name}</h1>
					<span className='icons'>
						{(this.props.slug && this.state.open) &&
						<a className='catalog-link'
							href={`http://catalog.stolaf.edu/academic-programs/${this.props.slug}/`}
							target='_blank'
							onClick={ev => ev.stopPropagation()}
							title='View in the St. Olaf Catalog'>
							Catalog
						</a>}
						{this.props.showCloseButton &&
						<Button className='area--remove-button' onClick={this.startRemovalConfirmation}>
							<Icon name='ionicon-close' />
						</Button>}
						<Icon className='area--open-indicator' name={this.state.open ? 'ionicon-chevron-up' : 'ionicon-chevron-down'} />
					</span>
				</div>
				<ProgressBar className={cx('area--progress', {error: this.props._error})} colorful={true}
					value={this.props._progress.at}
					max={this.props._progress.of} />
			</div>
		)

		const removalConfirmation = (
			<div className='area--confirm-removal'>
				<p>Remove <strong>{this.props.name}</strong>?</p>
				<span className='button-group'>
					<Button className='area--actually-remove-area' onClick={ev => this.props.removeArea({ev, areaId: this.props.id})}>Remove</Button>
					<Button onClick={this.endRemovalConfirmation}>Cancel</Button>
				</span>
			</div>
		)

		const contents = this.props._error
			? <p className='area--error'>{this.props._error} {':('}</p>
			: <Requirement {...this.props}
				topLevel
				addOverride={this.props.addOverride}
				toggleOverride={this.props.toggleOverride}
				removeOverride={this.props.removeOverride}
				path={[this.props.type, this.props.name]}
			/>

		return (
			<details className={cx('area', {errored: this.props._error})}>
				<summary className='area--summary' onClick={() => this.setState(state => ({open: !state.open}))}>
					{this.state.confirmRemoval
						? removalConfirmation
						: summary}
				</summary>
				{this.state.open && !this.state.confirmRemoval && contents}
			</details>
		)
	}
}

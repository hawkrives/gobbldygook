import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import Button from './button'
import Icon from './icon'
import Requirement from './requirement'
import ProgressBar from './progress-bar'

export default class AreaOfStudy extends Component {
	static propTypes = {
		_progress: PropTypes.shape({
			at: PropTypes.number.isRequired,
			of: PropTypes.number.isRequired,
		}),
		data: PropTypes.object,
		error: PropTypes.string,
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		removeArea: PropTypes.func.isRequired,
		result: PropTypes.object.isRequired,
		revision: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
	}

	static defaultProps = {
		_progress: {
			word: 'zero',
			at: 0,
			of: 1,
		},
		error: '',
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

	startRemovalConfirmation = (ev) => {
		ev.preventDefault()
		this.setState({confirmRemoval: true})
	}

	endRemovalConfirmation = (ev) => {
		ev.preventDefault()
		this.setState({confirmRemoval: false})
	}

	render() {
		const summary = (
			<div>
				<div className='area--summary-row'>
					<h1 className='area--title'>{this.props.name}</h1>
					<span className='icons'>
						<Button className='area--remove-button' onClick={this.startRemovalConfirmation}>
							<Icon name='ionicon-close' />
						</Button>
						<Icon className='area--open-indicator' name={this.state.open ? 'ionicon-chevron-up' : 'ionicon-chevron-down'} />
					</span>
				</div>
				<ProgressBar className={cx('area--progress', {error: this.props.error})} colorful={true}
					value={this.props._progress.at}
					max={this.props._progress.of} />
			</div>
		)

		const removalConfirmation = (
			<div className='area--confirm-removal'>
				<p>Remove <strong>{this.props.name}</strong>?</p>
				<span className='button-group'>
					<Button className='area--actually-remove-area' onClick={(ev) => this.props.removeArea({ev, areaId: this.props.id})}>Remove</Button>
					<Button onClick={this.endRemovalConfirmation}>Cancel</Button>
				</span>
			</div>
		)

		return (
			<details className={cx('area', {errored: this.props.error})}>
				<summary className='area--summary' onClick={() => this.setState(state => ({open: !state.open}))}>
					{this.state.confirmRemoval
						? removalConfirmation
						: summary}
				</summary>
				{this.state.open && !this.state.confirmRemoval
					? this.props.error
						? <p className='area--error'>{this.props.error} {':('}</p>
						: <Requirement {...this.props} topLevel />
					: null}
			</details>
		)
	}
}

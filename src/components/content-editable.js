import React, {PropTypes, Component} from 'react'
import cx from 'classnames'

export default class ContentEditable extends Component {
	// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable

	static propTypes = {
		className: PropTypes.string,
		onChange: PropTypes.func,
		value: PropTypes.string,
	}

	static defaultProps = {
		onChange: () => {},
		value: '',
	}

	constructor() {
		super()
		this.state = {
			lastValue: '',
		}
	}

	handleChange = ev => {
		const value = ev.target.textContent
		if (value !== this.props.value) {
			this.props.onChange({target: {value: value}})
		}
		this.setState({lastValue: value})
	}

	render() {
		// console.log('ContentEditable#render')
		return (<span className={cx('contenteditable', this.props.className)}
			onInput={this.handleChange}
			onBlur={this.handleChange}
			contentEditable={true}
			dangerouslySetInnerHTML={{__html: this.props.value}}
		/>)
	}
}

export default ContentEditable

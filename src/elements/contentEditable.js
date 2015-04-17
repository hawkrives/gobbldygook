import React from 'react'
import debounce from 'lodash/function/debounce'

class ContentEditable extends React.Component {
	// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
	constructor(props) {
		super(props)
		this.state = {
			content: props.content
		}

		this.handleChange = this.handleChange.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({content: nextProps.content})
	}

	handleChange(ev) {
		let {value} = ev.target

		if (this.props.onChange && value !== this.state.content) {
			this.debounce = this.debounce || debounce((val) => {
				this.props.onChange({target: {val}})
			}, 500, {'maxWait': 1000})
			this.debounce(value)
		}

		this.setState({content: value})
	}

	render() {
		// console.log('ContentEditable#render')
		return <input
			type={this.props.type}
			onChange={this.handleChange}
			onBlur={this.handleChange}
			value={this.state.content} />
	}
}

ContentEditable.propTypes = {
	onChange: React.PropTypes.func,
	content: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
	type: React.PropTypes.string,
}
ContentEditable.defaultProps = {
	content: '',
	type: 'text',
}

export default ContentEditable

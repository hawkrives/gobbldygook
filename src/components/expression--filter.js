import React, {Component, PropTypes} from 'react'

export default class Filter extends Component {
	static propTypes = {
		filter: PropTypes.object.isRequired,
	}

	render() {
		return JSON.stringify(this.props.filter, null, 2)
	}
}

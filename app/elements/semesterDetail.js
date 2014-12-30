import * as React from 'react'
import {State} from 'react-router'

let SemesterDetail = React.createClass({
	mixins: [State],
	render() {
		return React.createElement('div', null, JSON.stringify(this.getPath()))
	},
})

export default SemesterDetail

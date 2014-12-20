import * as React from 'react'
import {State} from 'react-router'

let SemesterDetail = React.createClass({
	render() {
		return JSON.stringify(this.getPath())
	}
})

export default SemesterDetail

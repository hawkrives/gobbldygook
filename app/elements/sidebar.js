import * as React from 'react'
import {State} from 'react-router'

import SearchButton from 'app/elements/searchButton'
import GraduationStatus from 'app/elements/graduationStatus'

let Sidebar = React.createClass({
	mixins: [State],
	render() {
		let isSearching = 'search' in this.getQuery()
		let sidebar = isSearching ?
			React.createElement(SearchButton, {search: isSearching}) :
			React.createElement(GraduationStatus, {student: this.props.student, sections: this.getQuery().sections})

		return React.createElement('aside', {className: 'sidebar'}, sidebar)
	},
})

export default Sidebar

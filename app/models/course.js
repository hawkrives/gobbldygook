'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

var Course = React.createClass({
	render() {
		let title = this.props.info.type === 'Topic' ? this.props.info.name : this.props.info.title;

		let summary = React.DOM.article({className: 'course'},
			React.DOM.div({className: 'info-rows'},
				React.DOM.h1({className: 'title'}, title),
				React.DOM.span({className: 'details'},
					React.DOM.span({className: 'identifier'},
						React.DOM.span({className: 'department'}, this.props.info.dept),
						' ', React.DOM.span({className: 'number'}, this.props.info.num),
						this.props.info.sect ?
							React.DOM.span({className: 'section'}, this.props.info.sect) :
							''),
					React.DOM.span({className: 'professors'}, humanize.oxford(this.props.info.profs)))
			),
			React.DOM.div({
				className: 'info-button',
			})
		)

		return summary;
	}
})

export default Course

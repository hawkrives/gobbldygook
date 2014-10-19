'use strict';

import _ from 'lodash'
import React from 'react'
import humanize from 'humanize-plus'

import DraggableMixin from '../mixins/draggable'

var Course = React.createClass({
	render() {
		return React.DOM.article({className: 'course'},
			React.DOM.h1({className: 'title'}, this.props.info.title),
			React.DOM.span({className: 'details'},
				React.DOM.span({className: 'identifier'},
					React.DOM.span({className: 'department'}, this.props.info.depts.join('/')),
					' ',
					React.DOM.span({className: 'number'}, this.props.info.num),
					this.props.info.sect ? React.DOM.span({className: 'section'}, this.props.info.sect) : ''
				),
				React.DOM.span({className: 'professors'}, humanize.oxford(this.props.info.profs))
			)
		)
	}
})

export default Course

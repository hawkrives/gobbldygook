var _ = require('lodash')
var React = require('react')
var humanize = require('humanize-plus')
var getCourse = require('../helpers/getCourses').getCourse

var DraggableMixin = require('../mixins/draggable')

var Course = React.createClass({
	mixins: [DraggableMixin],
	getInitialState: function() {
		return {
			clbid: undefined,
			credits: 0,
			crsid: undefined,
			depts: [],
			desc: undefined,
			gereqs: [],
			level: undefined,
			num: undefined,
			pf: undefined,
			places: [],
			profs: [],
			sect: undefined,
			sem: undefined,
			term: undefined,
			times: [],
			title: undefined,
			type: undefined,
			year: undefined
		}
	},
	componentDidMount: function() {
		var self = this
		getCourse(this.props.clbid).then(function(info) {
			if (self.isMounted()) {
				self.setState(info)
			}
		})
	},
	render: function() {
		return React.DOM.article({className: 'course'},
			React.DOM.h1({className: 'title'}, this.state.title),
			React.DOM.span({className: 'details'},
				React.DOM.span({className: 'identifier'}, 
					React.DOM.span({className: 'department'}, this.state.depts.join('/')),
					' ',
					React.DOM.span({className: 'number'}, this.state.num),
					this.state.sect ? React.DOM.span({className: 'section'}, this.state.sect) : ''
				),
				React.DOM.span({className: 'professors'}, humanize.oxford(this.state.profs))
			)
		)
	}
})

module.exports = Course

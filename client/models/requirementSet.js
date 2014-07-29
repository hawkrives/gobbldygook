var _ = require('lodash')
var React = require('react')

var Requirement = require('./requirement')

var RequirementSet = React.createClass({
	render: function() {
		console.log('requirement-set render')
		var requirements = _.map(this.props.requirements, function(req) {
			return Requirement({key: req.title,
				name: req.title, needs: req.needs,
				validCourses: req.courses,
				query: req.query,
				courses: this.props.courses
			})
		}, this);
		return (
			React.DOM.div({className: 'requirement-set'},
				React.DOM.h2(null, this.props.name, ' (', this.props.needs === true ? 'All' : this.props.needs, this.props.count, ')'),
				React.DOM.ul({className: 'requirement-list'},
					requirements
				)
			)
		)
	}
})

module.exports = RequirementSet

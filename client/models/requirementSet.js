var _ = require('lodash')
var React = require('react')

var Requirement = require('./requirement')

var RequirementSet = React.createClass({
	render: function() {
		// console.log('requirement-set render')
		// var requirements = _.map(this.props.requirements, function(req) {
		// 	return Requirement({key: req.title,
		// 		name: req.title, needs: req.needs,
		// 		validCourses: req.courses,
		// 		query: req.query,
		// 		courses: this.props.courses
		// 	})
		// }, this);

		// if (this.props.type === )

		return (
			React.DOM.div({className: 'requirement-set'},
				React.DOM.h2(null, this.props.title)//,
				// React.DOM.ul({className: 'requirement-list'},
				// 	requirements
				// )
			)
		)
	}
})

module.exports = RequirementSet

var React = require('react')
var _ = require('lodash')

var DraggableContainerMixin = require('../mixins/draggableContainer')
var Course = require('./course')

var CourseList = React.createClass({
	mixins: [DraggableContainerMixin],
	render: function() {
		var courseElements = _.map(this.props.courseObjects, function(c) {
			return Course( {key:c.clbid, info:c} )
		})

		console.log('courses', courseElements)

		return React.DOM.div( {className:"course-list"}, 
			courseElements
		)
	}
})

module.exports = CourseList

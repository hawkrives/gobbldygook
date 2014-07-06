var _ = require('lodash')
var React = require('react')

var Course = React.createClass({
	render: function() {
		return React.DOM.div(null, this.props.info.clbid);
	}
})

module.exports = Course

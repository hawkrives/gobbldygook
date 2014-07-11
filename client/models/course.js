var _ = require('lodash')
var React = require('react')

var Course = React.createClass({
	getInitialState: function() {
	},
	componentDidMount: function() {

	},
	componentWillUnmount: function() {

	},
	render: function() {
		return React.DOM.article({className: 'course'},
			React.DOM.h1({className: 'title'}, this.props.info.clbid),
			React.DOM.span({className: 'details'},
				React.DOM.span({className: 'identifier'}, 
					React.DOM.span({className: 'department'}, new String(this.props.info.clbid).substr(0, 3)),
					' ',
					React.DOM.span({className: 'number'}, new String(this.props.info.clbid).slice(-3)),
					this.props.info.sect ? React.DOM.span({className: 'section'}, this.props.info.clbid) : ''
				),
				React.DOM.span({className: 'professors'}, 
					Math.random() > 0.5 ? 'Mr.' : 'Ms.', ' ',
					this.props.info.clbid,
					' ',
					this.props.info.clbid
				)
			)
		)
	}
})

module.exports = Course

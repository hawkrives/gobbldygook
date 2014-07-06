var _ = require('lodash');
var React = require('react');

var AreaOfStudy = require('./areaOfStudy');

function makeCourseObjects(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for 
	// those clbids.
	return _.map(clbids, function(clbid) {
		var course;

        getCourse(clbid).then(
        	function(data) { 
        		course = data
        	}
        )

        return course;
	})
}

var GraduationStatus = React.createClass({
    getInitialState: function() {
        return {
            courses: [],
            areasOfStudy: {}
        };
    },
	componentWillReceiveProps: function(nextProps) {
		// Get course objects
		var schedules = R.get('schedules', nextProps)
		var activeSchedules = _.filter(schedules, 'active')
		var clbids = _.pluck(activeSchedules, 'clbids')
		clbids = _.flatten(clbids)
		clbids = _.uniq(clbids)
		courses = makeCourseObjects(clbids)

		// Get areas of study
		var areasOfStudy = _.groupBy(props.studies, 'type')
		areasOfStudy = _.mapValues(areasOfStudy, function(areas) {
			return _.map(areas, function(area) {
				area.key = area.title
				area.courses = props.courses
				return AreaOfStudy(area)
			}) 
		})

        this.setState({
            courses: courses,
            areasOfStudy: areasOfStudy
        });
    },
	render: function() {
		return 
			React.DOM.section( {className:"graduation-status"},
				React.DOM.section( {id:"general-education"},
					React.DOM.h1(null, "General Education"),
					React.DOM.p(null, this.props.moniker,"! You have ", React.DOM.output(null, "X"), " of ", React.DOM.output(null, "Y"), " credits!"),
					this.state.areasOfStudy.degree
				),
				React.DOM.section( {id:"majors"}, 
					React.DOM.h1(null, "Majors"),
					this.state.areasOfStudy.major
				),
				React.DOM.section( {id:"concentrations"}, 
					React.DOM.h1(null, "Concentrations"),
					this.state.areasOfStudy.concentration
				)
			)
	}
});

module.exports = GraduationStatus

var _ = require('lodash');
var React = require('react');

var GraduationStatus = require('./graduationStatus');
var CourseTable = require('./courseTable');

var Student = React.createClass({
    render: function() {
        console.log('student render')
        return (
            React.DOM.div( {className:"student"}, 
                GraduationStatus( {name:this.props.name,
                    schedules:this.props.schedules,
                    studies:this.props.studies}),
                CourseTable( {schedules:this.props.schedules})
            )
            // <CourseQuery />
        );
    }
});

module.exports = Student

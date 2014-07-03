var _ = require('lodash');
var AmpersandModel = require('ampersand-model');


module.exports = AmpersandModel.extend({
    type: 'user',
    props: {
        name: ['string', false, ''],
        studies: 'object',
        enrolled: ['number', false, 1874],
        graduation: ['number', false, 2014],
        schedules: 'array',
    },
    derived: {
        degrees: {
            deps: ['studies'],
            cache: true,
            fn: function () {
                return _.filter(this.studies, {kind: 'degree'});
            }
        },
        majors: {
            deps: ['studies'],
            cache: true,
            fn: function () {
                return _.filter(this.studies, {kind: 'major'});
            }
        },
        concentrations: {
            deps: ['studies'],
            cache: true,
            fn: function () {
                return _.filter(this.studies, {kind: 'concentration'});
            }
        },
        courses: {
            deps: ['schedules'],
            cache: true,
            fn: function() {
                var chosenSchedules = _.filter(this.schedules, 'chosen')
                var courses = _.map(chosenSchedules, function(schedule) {
                    // return _.map(schedule.courses, function(clbid) {
                    //     Course
                    // })
                })
                return _.flatten(courses)
            }
        }
    }
});

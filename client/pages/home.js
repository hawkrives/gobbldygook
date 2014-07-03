var PageView = require('./base');
var templates = require('../templates');


module.exports = PageView.extend({
    pageTitle: 'home',
    template: templates.pages.home,
    subviews: {
        graduationStatus: {
            container: '#graduation-status',
            prepareView: function (el) {
                return new GraduationStatusView({
                    el: el,
                    // submitCallback: function (data) {
                    //     app.people.create(data, {
                    //         wait: true,
                    //         success: function () {
                    //             app.navigate('/collections');
                    //         }
                    //     });
                    // }
                });
            }
        },
        courseTable: {
            container: '#course-table',
            prepareView: function (el) {
                return new CourseTableView({
                    el: el,
                });
            }
        }
    }
});

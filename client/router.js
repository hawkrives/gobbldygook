/*global me, app*/
var Router = require('ampersand-router');
var HomePage = require('./pages/home');
var CollectionDemo = require('./pages/collection-demo');
var InfoPage = require('./pages/info');
var PersonAddPage = require('./pages/person-add');
var PersonEditPage = require('./pages/person-edit');
var PersonViewPage = require('./pages/person-view');


module.exports = Router.extend({
    routes: {
        '': 'home',
        'term/:id': 'termDetail',
        // 'person/:id/edit': 'personEdit',
        '(*path)': 'catchAll'
    },

    // ------- ROUTE HANDLERS ---------
    home: function () {
        this.trigger('newPage', new HomePage({
            model: me
        }));
    },

    // collectionDemo: function () {
    //     this.trigger('newPage', new CollectionDemo({
    //         model: me,
    //         collection: app.people
    //     }));
    // },

    termDetail: function (id) {
        this.trigger('newPage', new TermDetailPage({
            id: id
        }));
    },

    catchAll: function () {
        this.redirectTo('');
    }
});

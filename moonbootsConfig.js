var config = require('getconfig')

// for reuse
var appDir = __dirname + '/client';
var cssDir = __dirname + '/public/css';
var bowerDir = __dirname + '/public/libraries'

module.exports = {
    // Tell the Hapi server what URLs the application should be served from.
    // Since we're doing clientside routing we want to serve this from some
    // type of wildcard url.

    // examples:
    //     '/{p*}' - match everything that isn't matched by something more specific
    //     '/dashboard/{p*}' - serve the app at all routes starting with '/dashbaord'
    
    appPath: '/{p*}',

    // The moonboots config
    moonboots: {
        // The base name of the javascript file served in the 
        // <script src="the_name.*.js">
        jsFileName: 'gobbldygook',
        
        // The base name of the javascript file served in the 
        // <link rel="stylesheet" src="the_name.*.css">
        cssFileName: 'gobbldygook',
        
        main: appDir + '/app.js',
        developmentMode: config.isDev,

        // Specify any non-commonjs libraries we wish to include. You can
        // think of this as your list of <script> tags in your HTML. These
        // will simply be included before any of your application code in the
        // order you provide them.
        libraries: [
            bowerDir + '/zepto/zepto.js',
            bowerDir + '/Element.details/__COMPILE/Element.details.js',
        ],

        // Specify the stylesheets we want to bundle
        stylesheets: [
            cssDir + '/app.css',
        ],
    }
};

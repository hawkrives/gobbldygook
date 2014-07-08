var Hapi = require('hapi');
var config = require('getconfig');
var server = new Hapi.Server('localhost', config.http.port);
var moonbootsConfig = require('./moonbootsConfig');
var electricfenceConfig =  require('./electricfenceConfig');
var internals = {};

// set clientconfig cookie
internals.configStateConfig = {
    encoding: 'none',
    ttl: 1000 * 60 * 15,
    isSecure: config.isSecure
};
server.state('config', internals.configStateConfig);
internals.clientConfig = JSON.stringify(config.client);
server.ext('onPreResponse', function(request, reply) {
    console.log('path:', request.path)
    if (!request.state.config) {
        var response = request.response;
        return reply(response.state('config', encodeURIComponent(internals.clientConfig)));
    }
    else {
        return reply();
    }
});

// require plugins: moonboots_hapi, lout for route docs, and electricfence for static files
server.pack.register([
        {plugin: require('moonboots_hapi'), options: moonbootsConfig},
        {plugin: require('lout')},
        {plugin: require('electricfence'), option: {electricfence: electricfenceConfig}}
    ],
    function (err) {
        if (err) throw err;
        
        server.start(function(err) {
            if (err) throw err;

            console.log('Gobbldygook is running @ ' + server.info.uri)
            console.log('lout docs initialized @ /docs')
            console.log('Electricfence public routes set.')
        })
    }
)

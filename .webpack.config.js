/* eslint module:true */

var getConfig = require('hjs-webpack')

var config = getConfig({
  // entry point for the app
  in: 'src/index.js',

  // Name or full path of output directory commonly named `www` or `public`.
  // This is where your fully static site should end up for simple deployment.
  out: 'build/',
  output: {
    publicPath: '',
  },

  // This will destroy and re-create your `out` folder before building so you
  // always get a fresh folder. Usually you want this but since it's
  // destructive we make it false by default
  clearBeforeBuild: '*.{js,css}',

  // To serve a default HTML file, or not to serve, that is the question.
  html: function(context) {
    return {
      'index.html': [
        '<!DOCTYPE html>',
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1.0" />',
        '<title>Gobbldygook</title>',
        context.css ? '<link rel="stylesheet" href="' + context.css + '">' : '',
        '<body>',
        '  <main id="app"></main>',
        '  <aside id="notifications"></aside>',
        '</body>',
        '<script src="' + context.main + '"></script>',
      ].join('\n')
    }
  },
})

config.module.loaders.unshift({
  test: /\.(svg)/,
  loader: 'file-loader',
})

module.exports = config

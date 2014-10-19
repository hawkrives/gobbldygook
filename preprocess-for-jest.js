var to5 = require('6to5');

module.exports = {
  process: function(src, path) {
    if (path.match(/\.js$/)) {
      return to5.transform(src).code;
    }
    return src;
  }
};

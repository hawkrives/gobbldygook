var gulp = require('gulp');
var del = require('del');
var config = require('../config').del;

// Clean Output Directory
gulp.task('clean', del.bind(null, [config.dest]));

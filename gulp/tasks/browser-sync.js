import gulp from 'gulp'
import browserSync from 'browser-sync'
import {browserSync as config} from '../config'

let browserSyncTask = () => { browserSync(config) }

gulp.task('browser-sync', browserSyncTask)

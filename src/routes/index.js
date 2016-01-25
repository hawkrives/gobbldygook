export default {
	component: 'div',
	childRoutes: [{
		path: '/',

		getIndexRoute(location, cb) {
			require.ensure([], () => {
				cb(null, {content: require('./app_content_student-picker').default})
			})
		},

		getChildRoutes(state, cb) {
			require.ensure([], () => {
				cb(null, [
					require('./app_content_edit-area').default,  // edit-area
					require('./app_overlay_search').default,  // search
					require('./app_content_degub').default,  // debug
					require('./app_content_new-student').default,
					require('./app_content_student').default, // s/:id
				])
			})
		},

		getComponent(location, cb) {
			require.ensure([], () => {
				cb(null, require('../containers/app').default)
			})
		},
	}],
}

// /
// /s/122932
// /s/122932/search
// /s/122932/2014/fall?search=dept:NOT+dept:AMCON+dept:GCON+gened:HBS

//<Route path='/' component={App}>
//	<IndexRoute components={{content: StudentPicker}} />
//	<Route path='search' components={{overlay: CourseSearcherOverlay}} />
//	<Route path='create' components={{content: NewStudent}} />
//	<Route path='edit-area(/:type)(/:name)(/:revision)' components={{content: AreaEditor}} />
//
//	<Route path='degub' components={{content: Degub}} />
//
//	<Route component={Student} path='s/:id/'>
//		<IndexRoute components={{content: CourseTable}} />
//		<Route path='share' components={{overlay: ShareSheet}} />
//		<Route path='search' components={{sidebar: CourseSearcher}} />
//		<Route path=':year/:semester' components={{content: SemesterDetail}} />
//	</Route>
//</Route>

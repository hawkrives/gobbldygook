export default {
	component: 'div',
	childRoutes: [{
		path: '/',

		getIndexRoute(location, cb) {
			require.ensure([], () => {
				cb(null, {content: require('./student-picker').default})
			})
		},

		getChildRoutes(state, cb) {
			require.ensure([], () => {
				cb(null, [
					require('./edit-area').default,  // edit-area
					require('./search').default,  // search
					require('./degub').default,  // debug
					// require('./new-student').default,
					require('./student').default, // s/:id
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
//	<Route path='search' components={{overlay: CourseSearcherSheet}} />
//	<Route path='wizard' components={{content: NewStudentWizard}} />
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

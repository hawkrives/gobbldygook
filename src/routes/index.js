export default {
	component: require('src/containers/app').default,
	childRoutes: [{
		path: '/',

		getIndexRoute(location, cb) {
			require.ensure([], () => {
				cb(null, {content: require('./index').default})
			}, 'app.index')
		},

		getChildRoutes(state, cb) {
			require.ensure([], () => {
				cb(null, [
					require('./edit-area').default, // edit-area
					require('./degub').default,  // degub
					require('./create').default, // create
					require('./student').default, // student
					require('./search').default, // search
					require('./not-found').default, // anything else
				])
			}, 'app.routes')
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
//	<Route path='degub' components={{content: Degub}} />
//	<Route component={Student} path='s/:id/'>
//		<IndexRoute components={{content: CourseTable}} />
//		<Route path='share' components={{overlay: ShareSheet}} />
//		<Route path='search' components={{sidebar: CourseSearcher}} />
//		<Route path=':year/:semester' components={{content: SemesterDetail}} />
//	</Route>
//</Route>

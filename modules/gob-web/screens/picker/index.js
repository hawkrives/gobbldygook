// @flow

import * as React from 'react'
import {Router} from '@reach/router'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'

let NotFound = () => <h1>404 Not Found</h1>

const StudentPicker = Loadable({
	loader: () => import('../../modules/student-picker'),
	loading: LoadingComponent,
})

let CourseSearcherOverlay = Loadable({
	loader: () => import('./search'),
	loading: LoadingComponent,
})

export default function() {
	return (
		<Router>
			<NotFound default />
			<StudentPicker path="/" />
			<CourseSearcherOverlay path="search" />
		</Router>
	)
}

StudentPicker.preload()

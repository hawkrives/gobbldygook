// @flow

import * as React from 'react'
import {Router} from '@reach/router'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'

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
		<>
			<StudentPicker />

			<Router>
				<CourseSearcherOverlay path="search" />
			</Router>
		</>
	)
}

StudentPicker.preload()

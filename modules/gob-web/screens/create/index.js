// @flow

import * as React from 'react'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'
import styled from 'styled-components'
import {Card} from '../../components/card'
import {Router} from '@reach/router'

let NotFound = () => <h1>404 Not Found</h1>

const WelcomePage = Loadable({
	loader: () => import('./welcome'),
	loading: LoadingComponent,
})

const ImportPage = Loadable({
	loader: () => import('./method-import'),
	loading: LoadingComponent,
})

const ManualPage = Loadable({
	loader: () => import('./method-manual'),
	loading: LoadingComponent,
})

const DrivePage = Loadable({
	loader: () => import('./method-drive'),
	loading: LoadingComponent,
})

const UploadPage = Loadable({
	loader: () => import('./method-upload'),
	loading: LoadingComponent,
})

const NewStudentPage = styled(Card)`
	margin: 40px auto;

	max-width: 40em;
	width: 100%;

	padding: 20px;

	.introduction {
		text-align: center;
		width: 75%;
		margin: 0 auto;
	}

	.header {
		text-align: center;

		h1 {
			font-weight: 400;
		}
		h2 {
			font-weight: 300;
		}
	}

	.choices {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;

		button {
			margin-bottom: 1em;
		}
	}
`

export default function() {
	return (
		<NewStudentPage>
			<Router>
				<NotFound default />
				<WelcomePage path="/" />

				<ImportPage path="sis" />
				<ManualPage path="manual" />
				<DrivePage path="drive" />
				<UploadPage path="upload" />
			</Router>
		</NewStudentPage>
	)
}

WelcomePage.preload()

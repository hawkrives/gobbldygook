// @flow

import * as React from 'react'
import {Router} from '@reach/router'
import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import styled, {createGlobalStyle} from 'styled-components'
import Loadable from 'react-loadable'
import {LoadingComponent} from './components/loading-comp'
import {Card} from './components/card'

let GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        box-sizing: inherit;
    }

    html {
        font-family: var(--sans-font-stack);
        color: var(--text-color);

        box-sizing: border-box;

        min-height: 100vh;

        line-height: 1.4;

        font-variant-ligatures: common-ligatures;
        hyphens: auto;
    }

    body {
        background: var(--background);
        height: 100%;
    }

    menu {
        padding: 0;
        margin: 0;
    }
`

const NotFoundCard = styled(Card)`
	margin: 40px auto;

	max-width: 40em;
	width: 100%;

	padding: 20px;

	text-align: center;
`

let NotFound = () => (
	<NotFoundCard>
		<h1>404 Not Found</h1>
		<p>It looks like nothing was found at this location.</p>
	</NotFoundCard>
)

let AreaEditor = Loadable({
	loader: () => import('./screens/area-editor'),
	loading: LoadingComponent,
})

let StudentPicker = Loadable({
	loader: () => import('./screens/picker'),
	loading: LoadingComponent,
})

let Degubber = Loadable({
	loader: () => import('./screens/degub'),
	loading: LoadingComponent,
})

let CreateStudent = Loadable({
	loader: () => import('./screens/create'),
	loading: LoadingComponent,
})

let Student = Loadable({
	loader: () => import('./screens/student'),
	loading: LoadingComponent,
})

let CourseSearcher = Loadable({
	loader: () => import('./screens/search'),
	loading: LoadingComponent,
})

// needs to be a stateful component: otherwise DragDropContext can't assign a ref, which it needs
class App extends React.Component<{}> {
	render() {
		return (
			<div>
				<GlobalStyle />
				<DocumentTitle title="Gobbldygook" />
				<Router>
					<NotFound default />

					<Degubber path="/degub" />
					<AreaEditor path="/areas" />
					<Student path="/student/:studentId/*" />
					<CreateStudent path="/create/*" />
					<CourseSearcher path="/search/*" />
					<StudentPicker path="/" />
				</Router>
			</div>
		)
	}
}

export default DragDropContext(HTML5Backend)(App)

// @flow

import * as React from 'react'
import {Router} from '@reach/router'
import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import {createGlobalStyle} from 'styled-components'
import Loadable from 'react-loadable'
import {LoadingComponent} from './components/loading-comp'

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

let NotFound = () => <h1>404 Not Found</h1>

let AreaEditor = Loadable({
	loader: () => import('@gob/area-editor').then(mod => mod.Editor),
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

// needs to be a stateful component: otherwise DragDropContext can't assign a ref, which it needs
class App extends React.Component<any> {
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
					<StudentPicker path="/*" />
				</Router>
			</div>
		)
	}
}

export default DragDropContext(HTML5Backend)(App)

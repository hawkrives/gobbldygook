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

        background: var(--background);
        min-height: 100vh;

        line-height: 1.4;

        font-variant-ligatures: common-ligatures;
        hyphens: auto;
    }

    body {
        height: 100%;
    }

    menu {
        padding: 0;
        margin: 0;
    }

    .content {
        padding-top: var(--page-edge-padding);
        padding-bottom: var(--page-edge-padding);
        overflow-y: scroll;
    }
`

let NotFound = () => <h1>404 Not Found</h1>

let AreaEditor = Loadable({
    loader: () =>
        import(/*webpackChunkName: 'screen.area-editor'*/ '@gob/area-editor'),
    loading: LoadingComponent,
    render: (loaded, props) => <loaded.Editor {...props} />,
})

let StudentPicker = Loadable({
    loader: () =>
        import(/*webpackChunkName: 'screen.student-picker'*/ './screens/picker'),
    loading: LoadingComponent,
})

let Degubber = Loadable({
    loader: () =>
        import(/*webpackChunkName: 'screen.degub'*/ './screens/degub'),
    loading: LoadingComponent,
})

let CreateStudent = Loadable({
    loader: () =>
        import(/*webpackChunkName: 'screen.create'*/ './screens/create'),
    loading: LoadingComponent,
})

let Student = Loadable({
    loader: () =>
        import(/*webpackChunkName: 'screen.student'*/ './screens/student'),
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

                    <StudentPicker path="/" />
                    <Degubber path="/degub" />
                    <AreaEditor path="/areas" />
                    <Student path="/student/:studentId" />
                    <CreateStudent path="/create/*" />
                </Router>
            </div>
        )
    }
}

export default DragDropContext(HTML5Backend)(App)

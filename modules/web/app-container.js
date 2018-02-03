// @flow

import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import * as React from 'react'
import PropTypes from 'prop-types'
import {DragDropContext} from 'react-dnd'
import {ThemeProvider, injectGlobal} from 'styled-components'
import StudentPicker from './modules/student-picker'
import * as theme from './theme'
import * as v from './theme/variables'

injectGlobal`
    *, *::before, *::after {
        box-sizing: inherit;
    }

    html {
        font-family: ${v.sansFontStack};
        color: ${v.textColor};

        box-sizing: border-box;

        background: ${v.background};
        min-height: 100vh;

        line-height: 1.4;

        font-feature-settings: 'liga', 'calt', 'kern';
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
        padding-top: ${v.pageEdgePadding};
        padding-bottom: 15vh;
        overflow-y: scroll;
    }
`

type Props = {
    content: React.Node,
    overlay: ?React.Node,
}

// needs to be a stateful component: otherwise DragDropContext can't assign a ref, which it needs
// eslint-disable-next-line react/prefer-stateless-function
export class App extends React.Component<Props> {
    static defaultProps = {
        content: <StudentPicker />,
    }

    render() {
        let {content, overlay} = this.props
        return (
            <DocumentTitle title="Gobbldygook">
                <ThemeProvider theme={theme}>
                    <div id="gateway-wrapper">
                        <div id="content-wrapper">{content}</div>
                        {overlay}
                    </div>
                </ThemeProvider>
            </DocumentTitle>
        )
    }
}

export default DragDropContext(HTML5Backend)(App)

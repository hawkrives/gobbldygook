// @flow

import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import React, { Component, PropTypes } from 'react'
import { DragDropContext } from 'react-dnd'
import { ThemeProvider } from 'styled-components'
import StudentPicker from './modules/student-picker'
import * as theme from './theme'

import './index.scss'

// needs to be a stateful component: otherwise DragDropContext can't assign a ref, which it needs
// eslint-disable-next-line react/prefer-stateless-function
export class App extends Component {
    static defaultProps = {
        content: <StudentPicker />,
    };

    static propTypes = {
        content: PropTypes.node.isRequired,
        overlay: PropTypes.node,
    };

    render() {
        let { content, overlay } = this.props
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

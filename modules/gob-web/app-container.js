// @flow

import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import * as React from 'react'
import {DragDropContext} from 'react-dnd'
import {injectGlobal} from 'styled-components'
import StudentPicker from './modules/student-picker'
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
        padding-bottom: ${v.pageEdgePadding};
        overflow-y: scroll;
    }
`

type Props = {
	content: React.Node,
	overlay: ?React.Node,
}

// needs to be a stateful component: otherwise DragDropContext can't assign a ref, which it needs
export class App extends React.Component<Props> {
	static defaultProps = {
		content: <StudentPicker />,
	}

	render() {
		let {content, overlay} = this.props
		return (
			<DocumentTitle title="Gobbldygook">
				<div id="gateway-wrapper">
					<div id="content-wrapper">{content}</div>
					{overlay}
				</div>
			</DocumentTitle>
		)
	}
}

export default DragDropContext(HTML5Backend)(App)

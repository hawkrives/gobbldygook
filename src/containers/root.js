const React = require('react')
const {PropTypes, cloneElement} = React
const {Provider} = require('react-redux')
import Notifications from './notifications'

let DevTools
if (DEVELOPMENT) {
	DevTools = require('./devtools')
}

const Root = props => (
	<Provider store={props.store}>
		<div id='app-wrapper'>
			{cloneElement(props.children)}
			<Notifications />
			{DevTools ? <DevTools /> : null}
		</div>
	</Provider>
)

Root.propTypes = {
	children: PropTypes.node,
	store: PropTypes.object.isRequired,
}

export default Root

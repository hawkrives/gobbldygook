import React, { PropTypes } from 'react'
import map from 'lodash/collection/map'
import size from 'lodash/collection/size'

export default function Degub(props) {
	const {students, areas, actions, canUndo, canRedo} = props
	console.log('degub.render', [size(students), size(areas), size(actions), canUndo, canRedo])
	return (
		<div className={`degub ${props.className || ''}`}>
			<button disabled={!canUndo} onClick={actions.undo}>Undo</button>
			<button disabled={!canRedo} onClick={actions.redo}>Redo</button>
			<ul>
				{map(students, (s, i) =>
					<li key={i}>{s.id} {s.name}</li>)}
			</ul>
			<ul>
				{map(areas, (s, i) =>
					<li key={i}>{s.name} ({s.revision})</li>)}
			</ul>
		</div>
	)
}

Degub.propTypes = {
	actions: PropTypes.objectOf(PropTypes.func).isRequired,
	areas: PropTypes.array.isRequired,
	canRedo: PropTypes.bool.isRequired,
	canUndo: PropTypes.bool.isRequired,
	className: PropTypes.string,
	students: PropTypes.object.isRequired,
}

Degub.defaultProps = {
	actions: {},
	areas: [],
	canRedo: false,
	canUndo: false,
	students: {},
}

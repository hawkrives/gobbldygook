import React, { PropTypes } from 'react'
import map from 'lodash/collection/map'
import size from 'lodash/collection/size'

export default function Degub({students, areas, actions}) {
	console.log('degub.render', [size(students), size(areas), size(actions)])
	return (
		<div>
			<button disabled={students.past.length === 0} onClick={actions.undo}>Undo</button>
			<button disabled={students.future.length === 0} onClick={actions.redo}>Redo</button>
			<ul>
				{map(students.present, (s, i) =>
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
	students: PropTypes.shape({ // a history object!
		past: PropTypes.arrayOf(PropTypes.object),
		present: PropTypes.object,
		future: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
}

Degub.defaultProps = {
	students: {},
	areas: [],
	actions: {},
}

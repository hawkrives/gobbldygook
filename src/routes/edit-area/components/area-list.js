import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import map from 'lodash/collection/map'
import sortBy from 'lodash/collection/sortBy'
import List from '../../../components/list'

export default function AreaList(props) {
	const areas = sortBy(props.areas, 'type', 'name', 'revision')
	return (
		<List type='plain'>
			{map(areas, a => {
				const url = `edit-area/${encodeURIComponent(a.type)}/${encodeURIComponent(a.name)}/${encodeURIComponent(a.revision)}`
				return (
					<li key={url}>
						<Link to={url}>{a.name} {a.type}, {a.revision}</Link>
					</li>
				)})}
		</List>
	)
}

AreaList.propTypes = {
	areas: PropTypes.arrayOf(PropTypes.object).isRequired,
}

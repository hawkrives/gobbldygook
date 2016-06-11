const React = require('react')
const {PropTypes} = React
import {Link} from 'react-router/es6'
import {map, sortBy} from 'lodash-es'
import List from '../../../components/list'

export default function AreaList(props) {
	const areas = sortBy(props.areas, 'type', 'name', 'revision')
	return (
		<List type='bullet'>
			{map(areas, a => {
				const url = `areas/${encodeURIComponent(a.type)}/${encodeURIComponent(a.name)}/${encodeURIComponent(a.revision)}`
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

// @flow
import React, { PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import List from '../../../components/list'

export default function AreaList(props: {areas: Object[]}) {
	const areas = sortBy(props.areas, 'type', 'name', 'revision')
	return (
		<List type="bullet">
			{map(areas, a => {
				const url = `areas/${encodeURIComponent(a.type)}/${encodeURIComponent(a.name)}/${encodeURIComponent(a.revision)}`
				return (
					<li key={url}>
						<Link to={url}>{a.name} {a.type}, {a.revision}</Link>
					</li>
				)
			})}
		</List>
	)
}

AreaList.propTypes = {
	areas: PropTypes.arrayOf(PropTypes.object).isRequired,
}

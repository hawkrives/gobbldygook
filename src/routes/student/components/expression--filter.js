import React, {PropTypes} from 'react'

export default function Filter(props) {
	return <div>{JSON.stringify(props.filter, null, 2)}</div>
}

Filter.propTypes = {
	filter: PropTypes.object,
}

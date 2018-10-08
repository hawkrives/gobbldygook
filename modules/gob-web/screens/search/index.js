// @flow

import React from 'react'
import {Link} from '@reach/router'
import {RaisedButton} from '../../components/button'
import {CourseSearcher} from '../../modules/course-searcher'
import styled from 'styled-components'

let Container = styled.div`
	max-width: 40em;
	min-width: 320px;
	margin: 3rem auto;

	.course-search--results_sizer {
		min-height: 350px;
	}
`

export default function CourseSearcherScreen(props: {}) {
	return (
		<>
			<RaisedButton as={Link} to="/" style={{margin: '1rem'}}>
				Home
			</RaisedButton>
			<Container>
				<CourseSearcher />
			</Container>
		</>
	)
}

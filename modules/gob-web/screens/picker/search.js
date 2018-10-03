// @flow

import React from 'react'

import Modal from '../../components/modal'
import {CourseSearcher} from '../../modules/course-searcher'
import styled from 'styled-components'

let StyledModal = styled(Modal)`
	width: 100vw;
	max-width: 40em;
	min-width: 320px;

	.course-search--results_sizer {
		min-height: 250px;
	}
`

type Props = {
	navigate?: string => mixed,
}

export default function CourseSearcherOverlay(props: Props) {
	let {navigate} = props

	if (!navigate) {
		return <p>Error: @reach/router did not pass navigate!</p>
	}

	let boundCloseModal = () => navigate('../')

	return (
		<StyledModal onClose={boundCloseModal} contentLabel="Search">
			<CourseSearcher onCloseSearcher={boundCloseModal} />
		</StyledModal>
	)
}

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
	navigate: string => mixed,
}

export default function CourseSearcherOverlay(props: Props) {
	const boundCloseModal = () => props.navigate('../')

	return (
		<StyledModal onClose={boundCloseModal} contentLabel="Search">
			<CourseSearcher onCloseSearcher={boundCloseModal} />
		</StyledModal>
	)
}

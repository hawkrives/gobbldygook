// @flow

import React from 'react'

import Modal from '../../components/modal'
import {CourseSearcher} from '../../modules/course-searcher'
import {createGlobalStyle} from 'styled-components'

let ModalStyle = createGlobalStyle`
	.modal--content .course-search {
		width: 100vw;
		max-width: 40em;

		.course-search--results_sizer {
			min-height: 250px;
		}
	}
`

type Props = {
	navigate: string => mixed,
}

export default function CourseSearcherOverlay(props: Props) {
	const boundCloseModal = () => props.navigate('../')

	return (
		<>
			<ModalStyle />
			<Modal onClose={boundCloseModal} contentLabel="Search">
				<CourseSearcher onCloseSearcher={boundCloseModal} />
			</Modal>
		</>
	)
}

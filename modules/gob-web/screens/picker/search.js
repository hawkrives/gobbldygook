// @flow

import React from 'react'

import Modal from '../../components/modal'
import CourseSearcher from '../../modules/course-searcher/course-searcher-container'
import {createGlobalStyle} from 'styled-components'

let ModalStyle = createGlobalStyle`
	.modal--content .course-search {
		width: 100vw;
		max-width: 40em;

		& > div {
			min-height: 250px;
		}
	}
`

type Props = {
	navigate: (string) => mixed,
}

export default function CourseSearcherOverlay(props: Props) {
	const boundCloseModal = () => props.navigate('../')

	return (
		<>
			<ModalStyle/>
			<Modal onClose={boundCloseModal} contentLabel="Search">
				<CourseSearcher closeSearcher={boundCloseModal} />
			</Modal>
		</>
	)
}

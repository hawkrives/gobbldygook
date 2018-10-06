// @flow

import React from 'react'
import styled from 'styled-components'
import {Card} from '../../components/card'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import {Toolbar} from '../../components/toolbar'
import Modal from '../../components/modal'
import {close} from '../../icons/ionicons'
import {Student} from '@gob/object-student'

type Props = {
	navigate: string => mixed,
	student: Student,
	queryString?: string,
}

const SizedCard = styled(Card)`
	width: 300px;
	height: 200px;

	margin: auto;
	padding: 1em;
`

export function ShareSheet(props: Props) {
	let {student, navigate, queryString = window.location.search} = props

	const boundCloseModal = () => {
		let params = new URLSearchParams(queryString)
		params.delete('share')
		navigate(`/student/${student.id}?${params.toString()}`)
	}

	if (!student) {
		return (
			<Modal onClose={boundCloseModal} contentLabel="Share">
				<SizedCard>
					<Toolbar>
						<FlatButton onClick={boundCloseModal}>
							<Icon>{close}</Icon>
						</FlatButton>
					</Toolbar>

					<p>No student given?</p>
				</SizedCard>
			</Modal>
		)
	}

	return (
		<Modal onClose={boundCloseModal} contentLabel="Share">
			<SizedCard>
				<Toolbar>
					<FlatButton onClick={boundCloseModal}>
						<Icon>{close}</Icon>
					</FlatButton>
				</Toolbar>

				<p>
					Share "{student.name}
					":
					<br />
					<a
						download={`${student.name}.gbstudent`}
						href={student.dataUrlEncode()}
					>
						Download file
					</a>
				</p>
			</SizedCard>
		</Modal>
	)
}

export default ShareSheet

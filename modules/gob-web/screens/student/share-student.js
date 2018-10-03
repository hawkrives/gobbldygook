// @flow

import React from 'react'
import {Card} from '../../components/card'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import {Toolbar} from '../../components/toolbar'
import Modal from '../../components/modal'
import List from '../../components/list'
import {close} from '../../icons/ionicons'
import {Student} from '@gob/object-student'

import {encodeStudent} from '@gob/object-student'

type Props = {
	navigate: string => mixed,
	student: Student,
	queryString?: string,
}

export function ShareSheet(props: Props) {
	let {student, navigate, queryString = window.location.search} = props

	const boundCloseModal = () => {
		let params = new URLSearchParams(queryString)
		params.delete('share')
		console.log(params.toString())
		navigate(`./${student.id}?${params.toString()}`)
	}

	if (!student) {
		return (
			<Modal onClose={boundCloseModal} contentLabel="Share">
				<Card>
					<Toolbar>
						<FlatButton onClick={boundCloseModal}>
							<Icon>{close}</Icon>
						</FlatButton>
					</Toolbar>

					<p>No student given?</p>
				</Card>
			</Modal>
		)
	}

	return (
		<Modal onClose={boundCloseModal} contentLabel="Share">
			<Card>
				<Toolbar>
					<FlatButton onClick={boundCloseModal}>
						<Icon>{close}</Icon>
					</FlatButton>
				</Toolbar>

				<>
					Share "{student.name}" via:
					<List type="bullet">
						<li>Google Drive (not implemented)</li>
						<li>
							<a
								download={`${student.name}.gbstudent`}
								href={student.dataUrlEncode()}
							>
								Download file
							</a>
						</li>
					</List>
				</>
			</Card>
		</Modal>
	)
}

export default ShareSheet

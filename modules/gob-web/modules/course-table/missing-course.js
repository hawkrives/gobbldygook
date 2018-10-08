// @flow

import React from 'react'
import FakeCourse from './fake-course'

type Props = {
	+className?: string,
	+clbid: string,
	+error: Error,
}

export default function MissingCourse(props: Props) {
	return (
		<FakeCourse
			title={`Cannot load course ${props.clbid}`}
			details={String(props.error.message)}
			className={`missing ${props.className || ''}`}
		/>
	)
}

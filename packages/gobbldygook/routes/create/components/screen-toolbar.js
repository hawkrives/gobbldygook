import React, {PropTypes} from 'react'

import Button from 'src/components/button'
import Toolbar from 'src/components/toolbar'

export default function ScreenToolbar({onNext, onBack}) {
	return (
		<Toolbar>
			<Button type='raised' disabled={!onBack} onClick={onBack}>Back</Button>
			<Button type='raised' disabled={!onNext} onClick={onNext}>Next</Button>
		</Toolbar>
	)
}
ScreenToolbar.propTypes = {
	onBack: PropTypes.func,
	onNext: PropTypes.func,
}

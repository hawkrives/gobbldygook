import React, {PropTypes} from 'react'

import Button from 'modules/web/components/button'
import Toolbar from 'modules/web/components/toolbar'

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

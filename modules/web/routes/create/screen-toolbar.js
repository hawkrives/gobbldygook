import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../components/button'
import Toolbar from '../../components/toolbar'

export default function ScreenToolbar({ onNext, onBack }) {
    return (
        <Toolbar>
            <Button type="raised" disabled={!onBack} onClick={onBack}>
                Back
            </Button>
            <Button type="raised" disabled={!onNext} onClick={onNext}>
                Next
            </Button>
        </Toolbar>
    )
}
ScreenToolbar.propTypes = {
    onBack: PropTypes.func,
    onNext: PropTypes.func,
}

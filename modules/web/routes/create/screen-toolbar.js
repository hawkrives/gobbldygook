// @flow

import React from 'react'
import PropTypes from 'prop-types'

import {RaisedButton} from '../../components/button'
import {Toolbar} from '../../components/toolbar'

type Props = {
    onBack: (ev: any) => any,
    onNext: (ev: any) => any,
}

export default function ScreenToolbar({onNext, onBack}: Props) {
    return (
        <Toolbar>
            <RaisedButton disabled={!onBack} onClick={onBack}>
                Back
            </RaisedButton>
            <RaisedButton disabled={!onNext} onClick={onNext}>
                Next
            </RaisedButton>
        </Toolbar>
    )
}

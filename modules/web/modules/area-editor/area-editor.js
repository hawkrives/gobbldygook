import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/yaml/yaml'
import Toolbar from '../../components/toolbar'
import Button from '../../components/button'
import Icon from '../../components/icon'
import Separator from '../../components/separator'

import {
    iosArrowLeft,
    iosDownloadOutline,
    iosReload,
    iosUploadOutline,
} from '../../icons/ionicons'

const TopToolbar = styled(Toolbar)`margin-bottom: 0.5em;`

export default function AreaEditor(props) {
    return (
        <div>
            <TopToolbar>
                <Button link to="/areas">
                    <Icon>{iosArrowLeft}</Icon> Back
                </Button>

                <Separator type="flex-spacer" />

                <Button onClick={props.onSave}>
                    <Icon>{iosDownloadOutline}</Icon> Save
                </Button>
                <Button>
                    <Icon>{iosReload}</Icon> Revert
                </Button>

                <Separator type="flex-spacer" />

                <Button>
                    <Icon>{iosDownloadOutline}</Icon> Download
                </Button>
                <Button>
                    <Icon>{iosUploadOutline}</Icon> Submit
                </Button>
            </TopToolbar>

            <CodeMirror
                value={props.value}
                onChange={props.onChange}
                options={{
                    lineNumbers: true,
                    mode: 'yaml',
                }}
                onFocusChange={props.onFocusChange}
            />
        </div>
    )
}

AreaEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    onFocusChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
}

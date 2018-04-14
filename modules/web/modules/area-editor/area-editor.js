// @flow
import React from 'react'

import styled from 'styled-components'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/yaml/yaml'
import {Toolbar} from '../../components/toolbar'
import {FlatButton, FlatLinkButton} from '../../components/button'
import Icon from '../../components/icon'
import Separator from '../../components/separator'

import {
    iosArrowLeft,
    iosDownloadOutline,
    iosReload,
    iosUploadOutline,
} from '../../icons/ionicons'

const TopToolbar = styled(Toolbar)`
    margin-bottom: 0.5em;
`

type Props = {
    onChange: (ev: any) => any,
    onFocusChange: (ev: any) => any,
    onSave: (ev: any) => any,
    value: string,
}

export default function AreaEditor(props: Props) {
    return (
        <div>
            <TopToolbar>
                <FlatLinkButton to="/areas">
                    <Icon>{iosArrowLeft}</Icon> Back
                </FlatLinkButton>

                <Separator type="flex-spacer" />

                <FlatButton onClick={props.onSave}>
                    <Icon>{iosDownloadOutline}</Icon> Save
                </FlatButton>
                <FlatButton>
                    <Icon>{iosReload}</Icon> Revert
                </FlatButton>

                <Separator type="flex-spacer" />

                <FlatButton>
                    <Icon>{iosDownloadOutline}</Icon> Download
                </FlatButton>
                <FlatButton>
                    <Icon>{iosUploadOutline}</Icon> Submit
                </FlatButton>
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

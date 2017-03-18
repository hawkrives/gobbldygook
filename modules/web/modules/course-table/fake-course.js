// @flow
import React from 'react'
import { Container, Title, SummaryRow } from '../course/compact'

type PropTypes = {
    className: string,
    details?: string,
    title: string,
};

export default function FakeCourse(props: PropTypes) {
    return (
        <Container className={props.className}>
            <Title name={props.title} />
            <SummaryRow>
                {props.details || 'no details'}
            </SummaryRow>
        </Container>
    )
}

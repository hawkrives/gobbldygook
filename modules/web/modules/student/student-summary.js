// @flow
import React from 'react'
import cx from 'classnames'
import listify from 'listify'
import groupBy from 'lodash/groupBy'
import sample from 'lodash/sample'

import AvatarLetter from '../../components/avatar-letter'
import ContentEditable from '../../components/content-editable'

import {
    getActiveStudentCourses,
} from '../../helpers/get-active-student-courses'
import { countCredits } from '../../../examine-student/count-credits'

import './student-summary.scss'

const welcomeMessages = [
    'Hi, ',
    'Hi there, ',
    'Hello, ',
    'こんにちは、', // japanese
    'ようこそ、', // japanese
    'Fram! Fram! ',
    'Salut, ',
    'Aloha, ',
    'Привет, ',
    'Вітаю, ',
    'Sawubona, ',
    'Hei, ',
    'Hola, ', // spanish
    'Bonjour, ', // french
    'Hallo, ', // german
    'nyob zoo ', // hmong
    '你好，', // mandarin
    '안녕하세요 ', // korean
    'สวัสดี ', // thai
    'halo, ', // indonesian
]

const welcomeMessage = sample(welcomeMessages)

type Student = Object;

export class StudentSummary extends React.PureComponent {
    props: {
        onChangeGraduation?: (string) => any,
        onChangeMatriculation?: (string) => any,
        onChangeName?: (string) => any,
        randomizeHello?: boolean,
        showAvatar?: boolean,
        showMessage?: boolean,
        student: Student,
    };

    render() {
        const {
            student,
            showMessage = true,
            showAvatar = true,
            randomizeHello = false,
            ...props
        } = this.props
        const { studies, canGraduate } = student

        const className = canGraduate ? 'can-graduate' : 'cannot-graduate'

        const currentCredits = countCredits(getActiveStudentCourses(student))
        const neededCredits = student.creditsNeeded

        return (
            <article className={cx('student-summary', className)}>
                <Header
                    canGraduate={canGraduate}
                    name={student.name}
                    onChangeName={props.onChangeName}
                    randomizeHello={randomizeHello}
                    showAvatar={showAvatar}
                />
                <div className="content">
                    <DateSummary
                        onChangeGraduation={props.onChangeGraduation}
                        onChangeMatriculation={props.onChangeMatriculation}
                        matriculation={student.matriculation}
                        graduation={student.graduation}
                    />

                    <DegreeSummary studies={studies} />

                    <CreditSummary
                        currentCredits={currentCredits}
                        neededCredits={neededCredits}
                    />

                    {showMessage ? <Footer canGraduate={canGraduate} /> : null}
                </div>
            </article>
        )
    }
}

export class Header extends React.PureComponent {
    props: {
        canGraduate: boolean,
        name: string,
        onChangeName: (string) => any,
        randomizeHello: boolean,
        showAvatar: boolean,
    };

    render() {
        const props = this.props

        const className = props.canGraduate
            ? 'can-graduate'
            : 'cannot-graduate'

        const avatar = props.showAvatar
            ? <AvatarLetter
                  className={cx('student-letter', className)}
                  value={props.name}
              />
            : null

        const message = props.randomizeHello
            ? sample(welcomeMessages)
            : welcomeMessage

        const name = (
            <ContentEditable
                editable={Boolean(props.onChangeName)}
                className="autosize-input"
                onBlur={props.onChangeName}
                value={String(props.name)}
            />
        )

        return (
            <header className="student-summary--header">
                {avatar}

                <div className="intro">
                    {message}{name}!
                </div>
            </header>
        )
    }
}

export class Footer extends React.PureComponent {
    goodGraduationMessage = [
        "It looks like you'll make it! Just follow the plan, and",
        'go over my output with your advisor a few times.',
    ].join(' ');

    badGraduationMessage = [
        "You haven't planned everything out yet.",
        'Ask your advisor if you need help fitting everything in.',
    ].join(' ');

    props: {
        canGraduate: boolean,
    };

    render() {
        const msg = this.props.canGraduate
            ? this.goodGraduationMessage
            : this.badGraduationMessage

        return (
            <div className="paragraph graduation-message">
                {msg}
            </div>
        )
    }
}

export class DateSummary extends React.PureComponent {
    props: {
        onChangeGraduation: (string) => any,
        onChangeMatriculation: (string) => any,
        matriculation: string,
        graduation: string,
    };

    render() {
        const props = this.props

        const matriculation = (
            <ContentEditable
                editable={Boolean(props.onChangeMatriculation)}
                className="autosize-input"
                onBlur={props.onChangeMatriculation}
                value={String(props.matriculation)}
            />
        )

        const graduation = (
            <ContentEditable
                editable={Boolean(props.onChangeGraduation)}
                className="autosize-input"
                onBlur={props.onChangeGraduation}
                value={String(props.graduation)}
            />
        )

        return (
            <p className="paragraph">
                After matriculating in {matriculation}, you are
                planning to graduate in {graduation}.
            </p>
        )
    }
}

export class DegreeSummary extends React.PureComponent {
    props: {
        studies: any[],
    };

    render() {
        const {
            degree: dS = [],
            major: mS = [],
            concentration: cS = [],
            emphasis: eS = [],
        } = groupBy(this.props.studies, s => s.type)

        const dCount = dS.length
        const mCount = mS.length
        const cCount = cS.length
        const eCount = eS.length

        const dWord = dCount === 1 ? 'degree' : 'degrees'
        const mWord = mCount === 1 ? 'major' : 'majors'
        const cWord = cCount === 1 ? 'concentration' : 'concentrations'
        const eWord = eCount === 1 ? 'emphasis' : 'emphases'

        const dEmph = dCount === 1 ? 'a ' : ''
        const mEmph = mCount === 1 ? 'a ' : ''
        const cEmph = cCount === 1 ? 'a ' : ''
        const eEmph = eCount === 1 ? 'an ' : ''

        const dList = listify(dS.map(d => d.name))
        const mList = listify(mS.map(m => m.name))
        const cList = listify(cS.map(c => c.name))
        const eList = listify(eS.map(e => e.name))

        return (
            <p className="paragraph">
                You are planning on{' '}
                {dCount > 0 ? `${dEmph}${dList} ${dWord}` : `no ${dWord}`}
                {mCount || cCount || eCount
                    ? mCount && (cCount || eCount) ? ', ' : ' and '
                    : ''}
                {mCount && `${mEmph}${mWord} in ${mList}`}
                {mCount && cCount ? ', and ' : ''}
                {cCount > 0 && `${cEmph}${cWord} in ${cList}`}
                {(mCount || cCount) && eCount ? ', ' : ''}
                {eCount > 0 && `not to mention ${eEmph}${eWord} in ${eList}`}
                {'. '}
            </p>
        )
    }
}

export class CreditSummary extends React.PureComponent {
    props: {
        currentCredits: number,
        neededCredits: number,
    };

    render() {
        const { currentCredits, neededCredits } = this.props
        const enoughCredits = currentCredits >= neededCredits

        return (
            <p className="paragraph">
                You have currently planned for {currentCredits}{' '}
                of your {neededCredits} required credits.
                {enoughCredits ? ' Good job!' : ''}
            </p>
        )
    }
}

import React from 'react'
import PropTypes from 'prop-types'
import Button from '../../components/button'
import cx from 'classnames'
import Autosize from 'react-input-autosize'
import Select from 'react-select'
import { connect } from 'react-redux'
import withRouter from 'react-router/lib/withRouter'
import map from 'lodash/map'
import filter from 'lodash/filter'
import 'react-select/dist/react-select.css'
import { initStudent } from '../../redux/students/actions/init-student'
import { filterAreaList } from '../../../object-student'

import './method-manual.scss'

let now = new Date()

class ManualCreationScreen extends React.Component {
    static propTypes = {
        areas: PropTypes.array.isRequired, // redux
        areasLoading: PropTypes.bool.isRequired, // redux
        dispatch: PropTypes.func.isRequired, // redux
        router: PropTypes.object.isRequired,
    };

    state = {
        error: '',
        name: 'Black Widow',
        matriculation: now.getFullYear() - 3,
        matriculationIsValid: true,
        graduation: now.getFullYear() + 1,
        graduationIsValid: true,
        degree: [],
        major: [],
        concentration: [],
        emphasis: [],
        sumitted: false,
    };

    getAreaOptions = type => {
        let { graduation } = this.state

        let filtered = filterAreaList(this.props.areas, { graduation })
        filtered = filter(filtered, { type })
        let options = map(filtered, ({ name, type, revision }) => ({
            name,
            type,
            revision,
            value: `${name} (${revision})`,
            label: `${name} (${revision})`,
        }))
        return options
    };

    handleAreaChange = type => values => {
        this.setState({ [type]: values })
    };

    handleNameChange = ev => {
        this.setState({ name: ev.target.value })
    };

    handleMatriculationChange = ev => {
        let val = Number(ev.target.value)
        if (!val || ev.target.value.length !== 4) {
            this.setState({ matriculationIsValid: false, matriculation: val })
        } else {
            this.setState({ matriculationIsValid: true, matriculation: val })
        }
        this.checkValidity()
    };

    handleGraduationChange = ev => {
        let val = Number(ev.target.value)
        if (!val || ev.target.value.length !== 4) {
            this.setState({ graduationIsValid: false, graduation: val })
        } else {
            this.setState({ graduationIsValid: true, graduation: val })
        }
        this.checkValidity()
    };

    checkValidity = () => {
        let errors = []

        if (!this.state.matriculationIsValid) {
            errors.push('Matriculation is invalid.')
        }
        if (!this.state.graduationIsValid) {
            errors.push('Graduation is invalid.')
        }

        if (errors.length) {
            this.setState({ error: errors.join('\n') })
        } else {
            this.setState({ error: '' })
        }
    };

    onCreateStudent = () => {
        this.setState({ submitted: true })

        let studies = [].concat(
            this.state.degree,
            this.state.major,
            this.state.concentration,
            this.state.emphasis
        )

        // pick out only the values that we want
        studies = map(studies, ({ name, revision, type }) => ({
            name,
            revision,
            type,
        }))

        let rawStudent = {
            name: this.state.name,
            matriculation: this.state.matriculation,
            graduation: this.state.graduation,
            studies,
        }

        let action = initStudent(rawStudent)
        this.props.dispatch(action)
        this.props.router.push(`/s/${action.payload.id}`)
    };

    render() {
        let nameEl = (
            <Autosize
                className="autosize-input"
                value={this.state.name}
                onChange={this.handleNameChange}
            />
        )

        let matriculationEl = (
            <Autosize
                className={cx('autosize-input', {
                    invalid: !this.state.matriculationIsValid,
                })}
                value={String(this.state.matriculation)}
                onChange={this.handleMatriculationChange}
            />
        )

        let graduationEl = (
            <Autosize
                className={cx('autosize-input', {
                    invalid: !this.state.graduationIsValid,
                })}
                value={String(this.state.graduation)}
                onChange={this.handleGraduationChange}
            />
        )

        return (
            <div className="manual">
                <header className="header">
                    <h1>Manually Create</h1>
                </header>

                {this.state.error
                    ? <pre className="errors">
                          {this.state.error}
                      </pre>
                    : null}

                <div className="intro">
                    Hi! My name is
                    {' '}
                    {nameEl}
                    .
                    <br />
                    I matriculated in
                    {' '}
                    {matriculationEl}
                    ,
                    and I plan to graduate in {graduationEl}.
                </div>

                <div className="areas">
                    <div className="row">
                        <label htmlFor="degreeSelector">Degrees:</label>
                        <Select
                            multi
                            inputProps={{ id: 'degreeSelector' }}
                            value={this.state.degree}
                            options={this.getAreaOptions('degree')}
                            onChange={this.handleAreaChange('degree')}
                        />
                    </div>
                    <div className="row">
                        <label htmlFor="majorSelector">Majors:</label>
                        <Select
                            multi
                            inputProps={{ id: 'majorSelector' }}
                            value={this.state.major}
                            options={this.getAreaOptions('major')}
                            onChange={this.handleAreaChange('major')}
                        />
                    </div>
                    <div className="row">
                        <label htmlFor="concentrationSelector">
                            Concentrations:
                        </label>
                        <Select
                            multi
                            inputProps={{ id: 'concentrationSelector' }}
                            value={this.state.concentration}
                            options={this.getAreaOptions('concentration')}
                            onChange={this.handleAreaChange('concentration')}
                        />
                    </div>
                    <div className="row">
                        <label htmlFor="emphasisSelector">
                            Areas of Emphasis:
                        </label>
                        <Select
                            multi
                            inputProps={{ id: 'emphasisSelector' }}
                            value={this.state.emphasis}
                            options={this.getAreaOptions('emphasis')}
                            onChange={this.handleAreaChange('emphasis')}
                        />
                    </div>
                </div>

                <div className="actions">
                    <Button
                        disabled={
                            Boolean(this.state.error) || this.state.submitted
                        }
                        onClick={this.onCreateStudent}
                    >
                        {!this.state.error ? "Let's go!" : 'Hmm…'}
                    </Button>
                </div>
            </div>
        )
    }
}

let mapState = state => ({
    areas: state.areas.data,
    areasLoading: state.areas.isLoading,
})

let mapDispatch = dispatch => ({ dispatch })

export default connect(mapState, mapDispatch)(withRouter(ManualCreationScreen))

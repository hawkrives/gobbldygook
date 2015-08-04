import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import round from 'lodash/math/round'
import {findWordForProgress} from 'sto-helpers'

export default class ProgressBar extends Component {
    static propTypes = {
        className: PropTypes.string,
        colorful: PropTypes.bool,
        max: PropTypes.number,
        value: PropTypes.number,
    }

    static defaultProps = {
        max: 1,
    }

    render() {
        const width = round(this.props.value / this.props.max)
        const progressWord = findWordForProgress(this.props.max, this.props.value)
        const classNames = cx('progress-bar',
            this.props.className,
            {[progressWord]: this.props.colorful})

        return (
            <div className={classNames}>
                <div className='progress-bar--track' style={{height: '100%', width: '100%'}}>
                    <div className='progress-bar--value' style={{height: '100%', width: `${width}%`}} />
                </div>
            </div>
        )
    }
}

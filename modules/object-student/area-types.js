// @flow
'use strict'

import type { AreaOfStudyTypeEnum } from '../examine-student/types'

const areaTypeConstants: {
    [key: string]: AreaOfStudyTypeEnum,
} = {
    DEGREE: 'degree',
    MAJOR: 'major',
    CONCENTRATION: 'concentration',
    EMPHASIS: 'emphasis',
    ID: 'interdisciplinary',
}

module.exports.areaTypeConstants = areaTypeConstants

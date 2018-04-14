// @flow

import type {AreaOfStudyTypeEnum} from '../examine-student/types'

export const areaTypeConstants: {
    [key: string]: AreaOfStudyTypeEnum,
} = {
    DEGREE: 'degree',
    MAJOR: 'major',
    CONCENTRATION: 'concentration',
    EMPHASIS: 'emphasis',
    ID: 'interdisciplinary',
}

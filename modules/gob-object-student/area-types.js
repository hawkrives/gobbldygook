// @flow

import type {AreaOfStudyTypeEnum} from '@gob/examine-student/source/types'

export const areaTypeConstants: {
    [key: string]: AreaOfStudyTypeEnum,
} = {
    DEGREE: 'degree',
    MAJOR: 'major',
    CONCENTRATION: 'concentration',
    EMPHASIS: 'emphasis',
    ID: 'interdisciplinary',
}

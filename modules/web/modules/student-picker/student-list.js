import React from 'react'
import PropTypes from 'prop-types'
import filter from 'lodash/filter'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import fuzzysearch from 'fuzzysearch'
import styled from 'styled-components'
import List from '../../components/list'
import StudentListItem from './student-list-item'

const ListOfStudents = styled(List)`
    ${props => props.theme.card} max-width: 35em;
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
`

export default function StudentList(props) {
    const { isEditing, destroyStudent, students } = props

    let {
        filter: filterText,
        sortBy: sortByKey,
        // groupBy: groupByKey,
    } = props

    filterText = filterText.toLowerCase()

    const studentObjects = map(
        sortBy(
            filter(students, s =>
                fuzzysearch(
                    filterText,
                    (s.data.present.name || '').toLowerCase()
                )
            ),
            s => s.data.present[sortByKey]
        ),
        (student, i) => (
            <StudentListItem
                key={student.data.present.id || i}
                student={student}
                destroyStudent={destroyStudent}
                isEditing={isEditing}
            />
        )
    )

    return <ListOfStudents type="plain">{studentObjects}</ListOfStudents>
}

StudentList.propTypes = {
    destroyStudent: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    groupBy: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    sortBy: PropTypes.oneOf(['dateLastModified', 'name', 'canGraduate'])
        .isRequired,
    students: PropTypes.object.isRequired,
}

StudentList.defaultProps = {
    filter: '',
    students: {},
}

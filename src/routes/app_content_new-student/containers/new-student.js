const React = require('react')
const {PropTypes} = React

// import './new-student.css'

export default function NewStudent(props) {
	return <div className='new-student'>{props.children}</div>
}

NewStudent.propTypes = {
	children: PropTypes.node.isRequired,
}

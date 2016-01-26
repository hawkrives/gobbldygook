import React, {Component, PropTypes, cloneElement} from 'react'
import DropZone from 'react-dropzone'

import './new-student.scss'


export default class NewStudent extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	};

	state = {
		files: [],
	};

	componentDidMount() {
		if (typeof window === 'undefined') {
			return
		}

		window.addEventListener('dragover', e => e.preventDefault())
		window.addEventListener('drop', e => e.preventDefault())
	}

	handleFileDrop = files => {
		this.setState({files})
	};

	render() {
		return (
			<DropZone
				ref={c => (this._dropzone = c)}
				className='dropzone'
				activeClassName='dropzone-active'
				accept='application/json'
				onDrop={this.handleFileDrop}
				multiple
				disableClick
			>
			<div className='new-student'>
				{cloneElement(this.props.children, {files: this.state.files})}
			</div>
			</DropZone>
		)
	}
}

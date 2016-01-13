import React, {Component, PropTypes} from 'react'
import yaml from 'js-yaml'
import cx from 'classnames'
import keymage from 'keymage'
import omit from 'lodash/object/omit'
import find from 'lodash/collection/find'
import Toolbar from '../components/toolbar'
import Button from '../components/button'
import Icon from '../components/icon'
import Separator from '../components/separator'
import studentActions from '../flux/student-actions'

import CodeMirror from 'react-codemirror'
import 'codemirror/mode/yaml/yaml'

import './area-editor.scss'

export default class AreaEditor extends Component {
	static propTypes = {
		allAreas: PropTypes.arrayOf(PropTypes.object).isRequired,
		className: PropTypes.string,
		params: PropTypes.object.isRequired,
		query: PropTypes.object.isRequired,
	}

	constructor() {
		super()
		this.state = {
			code: '',
			isEditing: false,
		}
	}

	componentDidMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.isEditing) {
			return
		}

		const {name, type, revision} = nextProps.query
		const area = find(nextProps.allAreas, area =>
			area.type === type && area.name === name && area.revision === revision)

		let data = omit(area, ['sourcePath'])
		if ('source' in data && typeof data.source === 'string') {
			data = data.source
		}
		else {
			data = yaml.safeDump(data)
		}

		this.setState({
			value: data,
		})
	}

	onUpdateCode = newValue => {
		this.setState({value: newValue})
	}

	// onSave = () => {
	// 	const {id: studentId} = this.props.params
	// 	const {name, type, revision} = this.props.query
	// 	const areaId = buildAreaId({name, type, revision})
	// 	console.log(`saving ${name} into ${studentId}`)

	// 	const {value} = this.state
	// 	areaId && studentActions.editArea(studentId, areaId, value)
	// }

	onFocusChange = focused => {
		if (focused) {
			keymage.pushScope('edit-area')
		}
		else {
			keymage.popScope()
		}

		this.setState({isEditing: focused})
	}

	render() {
		const options = {
			lineNumbers: true,
			mode: 'yaml',
		}

		return (
			<div className={cx(this.props.className)}>
				<Toolbar style={{marginBottom: '0.5em'}}>
					<Button onClick={this.onSave}>
						<Icon name='ios-download-outline' />
						<Separator type='spacer' />
						Save
					</Button>
					<Button>
						<Icon name='ios-reload' />
						<Separator type='spacer' />
						Revert
					</Button>

					<Separator type='spacer' />

					<Button>
						<Icon name='ios-download-outline' />
						<Separator type='spacer' />
						Download
					</Button>
					<Button>
						<Icon name='ios-upload-outline' />
						<Separator type='spacer' />
						Submit
					</Button>
				</Toolbar>
				<CodeMirror
					value={this.state.value}
					onChange={this.onUpdateCode}
					options={options}
					onFocusChange={this.onFocusChange}
				/>
			</div>
		)
	}
}

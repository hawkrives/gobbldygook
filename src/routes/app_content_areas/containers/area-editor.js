import React, {Component, PropTypes} from 'react'
import yaml from 'js-yaml'
import keymage from 'keymage'
import omit from 'lodash/omit'
import find from 'lodash/find'
import filter from 'lodash/filter'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadAllAreas } from '../../../redux/areas/actions'

import Loading from '../../../components/loading'
import AreaList from '../components/area-list'
import AreaEditor from '../components/area-editor'

export class AreaEditScreen extends Component {
	static propTypes = {
		areas: PropTypes.shape({
			data: PropTypes.arrayOf(PropTypes.object).isRequired,
			isLoading: PropTypes.bool.isRequired,
		}).isRequired, // redux
		loadAllAreas: PropTypes.func.isRequired,  // redux
		params: PropTypes.shape({
			name: PropTypes.string,
			type: PropTypes.string,
			revision: PropTypes.string,
		}).isRequired,  // react-router
		routing: PropTypes.object.isRequired,  // react-router
	};

	state = {
		area: null,
		code: '',
		isEditing: false,
	};

	componentWillMount() {
		this.props.loadAllAreas()
	}

	componentDidMount() {
		this.handleNewData(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.handleNewData(nextProps)
	}

	handleNewData = props => {
		if (this.state.isEditing) {
			return
		}

		let {type, name, revision} = props.params

		if (!type || !name || !revision) {
			return
		}

		const allAreas = props.areas.data

		const area = find(allAreas, area =>
			area.type === type && area.name === name && area.revision === revision)

		let data = omit(area, 'sourcePath')
		if ('source' in data && typeof data.source === 'string') {
			data = data.source
		}
		else {
			data = yaml.safeDump(data)
		}

		this.setState({
			area: data,
		})
	};

	handleChange = newValue => {
		this.setState({area: newValue})
	};

	handleSave = () => {};

	handleFocusChange = focused => {
		if (focused) {
			keymage.pushScope('edit-area')
		}
		else {
			keymage.popScope()
		}

		this.setState({isEditing: focused})
	};

	render() {
		let {type, name, revision} = this.props.params

		if (this.state.area && (type && name && revision)) {
			return (<AreaEditor
				onSave={this.handleSave}
				value={this.state.area}
				onChange={this.handleChange}
				onFocusChange={this.handleFocusChange}
			/>)
		}

		if (this.props.areas.isLoading) {
			return <Loading>Loading areas…</Loading>
		}

		let areas = this.props.areas.data

		if (name) {
			name = decodeURIComponent(name)
			areas = filter(areas, {name})
		}
		if (type) {
			type = decodeURIComponent(type)
			areas = filter(areas, {type})
		}

		return <AreaList areas={areas} />
	}
}


const mapStateToProps = state => ({
	areas: state.areas,
	routing: state.routing,
})

const mapDispatchToProps = dispatch => ({
	...bindActionCreators({loadAllAreas}, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AreaEditScreen)

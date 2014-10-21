'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import Dialog from '../models/dialog'

var LoadStudent = React.createClass({
	render() {
		var students = ItemGrid({data: studentFiles})
		return Dialog(
			{
				className: 'load-student',
				titlebar: {
					title: 'Load Student',
					editButtons: [
						PopoverButton({title: 'Sort'}),
						PopoverButton({title: 'Filter'}),
						InlineSearchBox({placeholder: 'Find'}),
						ToolbarButton({title: 'Edit'}),
					],
					otherButtons: [
						ToolbarButton({title: 'Import'}),
						ToolbarButton({title: 'Pair'}),
					],
				},
				toolbar: {
					startButtons: [
						ToolbarButton({title: 'Delete'}),
					],
					endButtons: [
						ToolbarButton({title: 'Load Student'}),
					]
				},
			},
			students
		)
	}
})

var _ = require('lodash')
var React = require('react')
var Dialog = require('../models/dialog')

var LoadStudent = React.createClass({
	render: function() {
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

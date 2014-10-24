'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import {DragDropMixin} from '../../node_modules/react-dnd/dist/ReactDND.min'
import itemTypes from '../objects/itemTypes'

var Course = React.createClass({
	mixins: [DragDropMixin],

	configureDragDrop(registerType) {
		registerType(itemTypes.COURSE, {
			dragSource: {
				beginDrag() {
					return {
						item: {clbid: this.props.info.clbid}
					}
				},
				endDrag(didDrop) {
					if (didDrop) {
						if (this.props.schedule) {
							console.log(
								'removing course', this.props.info.clbid,
								'from', this.props.schedule.id)
							this.props.schedule.removeCourse(this.props.info.clbid)
						}
					}
				}
			}
		})
	},

	render() {
		let title = this.props.info.type === 'Topic' ? this.props.info.name : this.props.info.title;

		let summary = React.DOM.article(
			Object.assign({className: 'course'}, this.dragSourceFor(itemTypes.COURSE)),

			React.DOM.div({className: 'info-rows'},
				React.DOM.h1({className: 'title'}, title),
				React.DOM.span({className: 'details'},
					React.DOM.span({className: 'identifier'},
						React.DOM.span({className: 'department'}, this.props.info.dept),
						' ', React.DOM.span({className: 'number'}, this.props.info.num),
						this.props.info.sect ?
							React.DOM.span({className: 'section'}, this.props.info.sect) :
							''),
					React.DOM.span({className: 'professors'}, humanize.oxford(this.props.info.profs)))
			),
			React.DOM.div({
				className: 'info-button',
			})
		)

		return summary;
	}
})

export default Course

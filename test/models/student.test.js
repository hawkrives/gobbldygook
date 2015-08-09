// test/models/student.test.js
import Student from '../../src/models/student.js'
import demoStudent from '../../src/models/demo-student.json'
import Immutable from 'immutable'
import size from 'lodash/collection/size'
import filter from 'lodash/collection/filter'

describe('Student', () => {
	it('is a Student', () => {
		const stu = new Student(demoStudent)
		expect(stu instanceof Student).to.be.true
	})

	it('can be turned into a JS object', () => {
		const stu = new Student(demoStudent)
		expect(stu.toJS() instanceof Object).to.be.true
	})

	it('ignores sets on known properties', () => {
		const stu = new Student(demoStudent)
		try {
			stu.name = 3
		}
		catch (err) {}
		expect(stu.name).to.equal('Hawken MacKay Rives')
	})

	it('creates a unique ID for each new student without an ID prop', () => {
		let stu1 = new Student()
		let stu2 = new Student()
		expect(stu1.id).to.not.equal(stu2.id)
	})

	it('holds a student', () => {
		const stu = new Student(demoStudent)
		let {
			id,
			matriculation,
			graduation,
			studies,
			schedules,
			overrides,
			fabrications,
			settings,
			creditsNeeded,
		} = stu

		expect(stu).to.exist
		expect(id).to.exist
		expect(matriculation).to.equal(2012)
		expect(graduation).to.equal(2016)
		expect(studies.toList().toJSON()).to.deep.equal(demoStudent.studies)
		expect(schedules.toList().toJSON()).to.deep.equal(demoStudent.schedules)
		// expect(fabrications.toJS()).to.deep.equal(demoStudent.fabrications)
		expect(settings.toJS()).to.deep.equal(demoStudent.settings)
		expect(creditsNeeded).to.equal(35)
		expect(overrides.toJSON()).to.deep.equal(demoStudent.overrides)
	})

	it('can turn into JSON', () => {
		const stu = new Student(demoStudent)
		let result = JSON.stringify(stu)
		expect(result).to.be.ok
	})

	it('returns a promise for data', () => {
		const stu = new Student(demoStudent)
		expect(stu.data().then).to.exist
	})

	describe('fabrications', () => {
		it('supports adding fabrications', () => {
			const stu = new Student(demoStudent)
			let addedFabrication = stu.addFabrication({id: 'a'})
			expect(addedFabrication.fabrications.get('a')).to.deep.equal({id: 'a'})
		})
		it('supports removing fabrications', () => {
			const stu = new Student(demoStudent)
			let addedFabrication = stu.addFabrication({id: 'a'})
			let noMoreFabrication = addedFabrication.removeFabrication('a')
			expect(noMoreFabrication.fabrications.has('a')).to.be.false
		})
	})
	describe('overrides', () => {
		it('supports adding overrides', () => {
			const stu = new Student(demoStudent)
			let addedOverride = stu.setOverride({nothing: 'me!'})
			expect(addedOverride.overrides.get('nothing')).to.equal('me!')
		})
		it('supports removing overrides', () => {
			const stu = new Student(demoStudent)
			let removedOverride = stu.removeOverride('credits.taken')
			expect(removedOverride.overrides.get('credits.taken')).to.not.exist
		})
	})
	describe('areas', () => {
		it('supports adding areas', () => {
			const stu = new Student(demoStudent)
			let newArea = stu.addArea({name: 'Exercise Science', type: 'major', revision: '2014-15'})
			expect(newArea.studies.get('exercise-science-major?rev=2014-15')).to.exist
		})
		it('supports removing areas', () => {
			const stu = new Student(demoStudent)
			let noCsci = stu.removeArea('m-csci')
			expect(noCsci.studies.get('m-csci')).to.not.exist
		})
		it('supports removing multiple areas at one time', () => {
			const stu = new Student(demoStudent)
			let noCsci = stu
				.removeArea('m-csci')
				.addArea({id: 'm-esth', revisionYear: 2014})
			let noEsth = noCsci.removeArea('m-esth')
			expect(noEsth.studies.get('m-csci')).to.not.exist
			expect(noEsth.studies.get('m-esth')).to.not.exist
		})
	})
	describe('courses', () => {
		xit('returns only courses from active schedules', () => {
			const stu = new Student(demoStudent)
			// disabled until we can mock getCourses
			let courseCountFromActive = size(pluck(filter(demoStudent.schedules, 'active'), 'clbids'))
			stu.courses.then(courses => expect(courses.length).to.equal(courseCountFromActive))
		})
		xit('counts all credits currently scheduled', () => {
			const stu = new Student(demoStudent)
			// disabled until we can mock getCourses
			// plus, I'm not even sure how to check the result. lodash?
			stu.courseCredits.then(credits => expect(credits).to.be.ok)
		})
		it('supports moving courses between schedules in one-ish operation', () => {
			const stu = new Student(demoStudent)
			let movedCourse = stu.moveCourse(1, 2, 82908)
			expect(movedCourse.schedules.get(1).clbids).to.not.include(82908)
			expect(movedCourse.schedules.get(2).clbids).to.include(82908)
		})
	})
	describe('schedules', () => {
		it('supports adding schedules', () => {
			const stu = new Student(demoStudent)
			let newSchedule = stu.addSchedule({id: 10912, title: 'a'})
			expect(newSchedule.schedules.get(10912).toJSON()).to.deep.equal({
				id: 10912,
				active: false,
				clbids: [],
				index: 1,
				semester: 0,
				title: 'a',
				year: 0,
			})
		})

		it('supports removing schedules', () => {
			const stu = new Student(demoStudent)
			let removedSchedule = stu.destroySchedule(1)
			expect(removedSchedule.schedules.get(1)).to.not.exist
		})

		it('supports removing multiple schedules at once', () => {
			const stu = new Student(demoStudent)
			let removedSchedule = stu.destroyMultipleSchedules([1, 2])
			expect(removedSchedule.schedules.get(1)).to.not.exist
			expect(removedSchedule.schedules.get(2)).to.not.exist
		})
	})
	describe('properties', () => {
		it('supports changing the name', () => {
			const stu = new Student(demoStudent)
			let newName = stu.changeName('Andrew Joseph Volz')
			expect(newName.name).to.equal('Andrew Joseph Volz')
		})

		it('supports changing the number of credits needed', () => {
			const stu = new Student(demoStudent)
			let newCredits = stu.changeCreditsNeeded(1)
			expect(newCredits.creditsNeeded).to.equal(1)
		})

		it('supports changing the matriculation', () => {
			const stu = new Student(demoStudent)
			let newMatriculation = stu.changeMatriculation(1)
			expect(newMatriculation.matriculation).to.equal(1)
		})

		it('supports changing the graduation', () => {
			const stu = new Student(demoStudent)
			let newGraduation = stu.changeGraduation(1)
			expect(newGraduation.graduation).to.equal(1)
		})

		it('supports changing settings', () => {
			const stu = new Student(demoStudent)
			let newSetting = stu.changeSetting('setting', 'value')
			expect(newSetting.settings.get('setting')).to.equal('value')
		})
	})
})

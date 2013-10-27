from major import Major
from concentration import Concentration
from course import Course, get_course
from standing import Standing
from ID import ID
from requirement import fol_t

from collections import OrderedDict
from yaml import load
try:
	from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
	from yaml import Loader, Dumper

from helpers import get_list_as_english, get_readable_list

class Student:
	name = ""
	start_year = 0
	end_year = 0

	majors = []
	concentrations = []
	courses = {}
	standing = Standing()

	def __init__(self, filename=""):
		with open(filename) as infile:
			data = load(infile, Loader=Loader)

			if 'name' in data:
				self.name = data['name']

			if 'start' in data:
				self.start_year = data['start']
			if 'end' in data:
				self.end_year = data['end']

			if 'majors' in data:
				for major_name in data['majors']:
					self.add_major(major_name)

			if 'concentrations' in data:
				if not data['concentrations']:
					print("You don't have any concentrations?")
				else:
					for concentration_name in data['concentrations']:
						self.add_concentration(concentration_name)

			if 'courses' in data:
				if not data['courses']:
					print("You haven't taken any courses?")
				else:
					self.set_up_courses(data['courses'])
					for year in data['courses']:
						shortyear = int(year[:4])
						for semester in data['courses'][year]:
							semester = self.check_semester_name(semester)
							for course_name in data['courses'][year][semester]:
								course = get_course(course_name, shortyear, semester)
								if course:
									self.standing.increment(course.credits)
									self.add_course(course, shortyear, semester)
								else:
									print("A bad course identifier was passed:", course_name)
									# break
					self.sort_courses()

			if 'geneds' in data:
				for req in data['geneds']:
					self.standing.geneds[req].increment()

			if 'credits' in data:
				for credit in data['credits']:
					self.standing.increment(credit)



	def set_up_courses(self, data):
		for year in data:
			shortyear = int(year[:4])
			self.courses[shortyear] = OrderedDict()
			for semester in data[year]:
				self.courses[shortyear][semester] = []

	def check_semester_name(self, name):
		# print(name)
		# print(self.courses)
		return name

	def sort_courses(self):
		for year in self.courses:
			self.courses[year] = (OrderedDict(sorted(self.courses[year].items(), key=lambda t: t[0])))
			# for key, value in self.courses[year].items():
				# print(key, value[0])


	def __eq__(self, other):
		if isinstance(other, Student):
			return (
				self.name == other.name
				and self.start_year == other.start_year
				and self.end_year == other.end_year
				and self.majors == other.majors
				and self.concentrations == other.concentrations
				and self.courses == other.courses
				and self.standing == other.standing
			)
		else:
			return False


	def __str__(self):
		self.update_standing()
		output = self.name + ", "

		if self.majors:
			output += "you are majoring in "
			output += get_list_as_english(self.majors)

		if self.concentrations:
			if len(self.concentrations) is 1:
				output += "with a concentration in "
			else:
				output += "with concentrations in "
			output += get_list_as_english(self.concentrations)[:-1]
			output += ","


		if self.majors:
			output += " while taking:" + '\n'
		else:
			output += " you are taking: " + '\n'


		for year in self.courses:
			for semester in self.courses[year]:
				output += "" + str(semester).title() + " of " + str(year) + "-" + str(year+1) + ": \n"
				output += get_readable_list(self.courses[year][semester], sep='\n', end='\n')
			output += '\n'


		output += "As such, you must fulfill these requirements to graduate: " + '\n'

		for major in self.majors:
			output += "For " + str(major.name) + ": " + '\n'
			output += get_readable_list(major.requirements, sep='\n', end='\n')

			if major.special_requirements:
				output += get_readable_list(major.special_requirements, sep='\n', end='\n')
			output += '\n'

		for concentration in self.concentrations:
			output += "For " + str(concentration.name) + ": " + '\n'
			output += get_readable_list(concentration.requirements, sep='\n', end='\n')

			if concentration.special_requirements:
				output += get_readable_list(concentration.special_requirements, sep='\n', end='\n')

			output += '\n'


		output += str(self.standing)

		return output


	def update_standing(self):
		for major in self.majors:
			major.requirements.sort(key=lambda m: m.name)
			major.special_requirements.sort(key=lambda m: m.name)

		for conc in self.concentrations:
			conc.requirements.sort(key=lambda c: c.name)
			conc.special_requirements.sort(key=lambda c: c.name)

		for year in self.courses.values():
			for semester in year.values():
				for course in semester:
					for major in self.majors:
						for requirement in major.requirements:
							requirement.check_requirement(course.id)

						for requirement_set in major.special_requirements:
							requirement_set.check_requirement(course.id)

					for concentration in self.concentrations:
						for requirement in concentration.requirements:
							requirement.check_requirement(course.id)

						for requirement_set in concentration.special_requirements:
							requirement_set.check_requirement(course.id)

					for req in self.standing.geneds.values():
						if req in course.geneds:
							if req == "SPM": # SPM requires two _courses_, rather than `n` _credits_.
								req.increment(1.0, course.id)
							else:
								req.increment(course.credits, course.id)

					for req in fol_t: # check for FOL-J, FOL-N, etc.
						if req in course.geneds:
							self.standing.geneds["FOL"].increment(1.0, course.id)



	def has_taken_course(self, identifier):
		# TODO: Check to see if this needs updating.
		if ID(identifier) in self.courses:
			return True
		else:
			return False


	def add_course(self, course, year, semester):
		if not isinstance(course, Course):
			course = get_course(course, year, semester)

		self.courses[year][semester].append(course)


	def add_major(self, major):
		if not isinstance(major, Major):
			major = Major(major)
		self.majors.append(major)


	def add_concentration(self, concentration):
		if not isinstance(concentration, Concentration):
			concentration = Concentration(concentration)
		self.concentrations.append(concentration)

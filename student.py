from major import Major
from concentration import Concentration
from course import Course, getCourse
from standing import Standing
from ID import ID

from yaml import load, dump
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
	courses = []
	standing = Standing()

	def __init__(self, filename=""):
		self.create_student_from_yaml(filename)
		# self.create_student_from_file(filename)

	def create_student_from_yaml(self, filename):
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
					self.addMajor(major_name)

			if 'concentrations' in data:
				if not data['concentrations']:
					print("You don't have any concentrations?")
				else:
					for concentration_name in data['concentrations']:
						self.addConcentration(concentration_name)

			if 'courses' in data:
				if not data['courses']:
					print("You don't have any courses?")
				else:
					for course_name in data['courses']:
						course = getCourse(course_name)
						self.standing.increment(course.credits)
						self.addCourse(course)


	def create_student_from_file(self, filename):
		heading = ""
		with open(filename) as infile:
			for line in infile:
				line = line.rstrip()
				if not line:
					continue

				if not heading:
					heading = "NAME"

				elif line[0] == '#':
					line = line.upper()
					heading = line[2:]
					continue

				elif line:
					if line[0:2] == "//":
						pass  # it's a comment

					elif heading == "NAME":
						self.name = line

					elif heading == "MAJORS":
						self.addMajor(line)

					elif heading == "CONCENTRATIONS":
						self.addConcentration(line)

					elif heading == "COURSES":
						course = getCourse(line)
						self.standing.increment(course.credits)
						self.addCourse(line)

					elif heading == "LABS":
						course = getCourse(line)
						self.standing.increment(course.credits)
						self.addCourse(course)


	def __eq__(self, other):
		return (
			self.name == other.name 
			and self.start_year == other.start_year
			and self.end_year == other.end_year
			and self.majors == other.majors
			and self.concentrations == other.concentrations
			and self.courses == other.courses
			and self.standing == other.standing
		)


	def __str__(self):
		self.updateStanding()
		output = self.name + ", "
		
		if self.majors:
			output += "you are majoring in "
			output += get_list_as_english(self.majors)
		
		if self.concentrations:
			if len(self.concentrations) is 1:
				output += "with a concentration in "
			else:
				output += "with concentrations in "
			output += get_list_as_english(self.concentrations)
			output += ", "


		if self.majors:
			output += "while taking:" + '\n'
		else:
			output += "you are taking: " + '\n'


		for course in self.courses:
			output += str(course) + '\n'

		output += '\n'

		output += "As such, you must fulfill these requirements to graduate: " + '\n'

		for major in self.majors:
			output += "For " + str(major.name) + ": " + '\n'
			output += get_readable_list(major.requirements, sep='\n', end='\n')

			if major.specialRequirements:
				output += get_readable_list(major.specialRequirements, sep='\n', end='\n')
			output += '\n'

		for concentration in self.concentrations:
			output += "For " + str(concentration.name) + ": " + '\n'
			output += get_readable_list(concentration.requirements, sep='\n', end='\n')

			if concentration.specialRequirements:
				output += get_readable_list(concentration.specialRequirements, sep='\n', end='\n')

			output += '\n'

		output += str(self.standing)

		return output


	def updateStanding(self):
		for major in self.majors:
			for course in self.courses:
				for requirement in major.requirements:
					if requirement.fulfillsRequirement(course.id):
							requirement.increment()

				for requirement_set in major.specialRequirements:
					for requirement in requirement_set.valid:
						if requirement.fulfillsRequirement(course.id):
							requirement.increment()

		for concentration in self.concentrations:
			for course in self.courses:
				for requirement in concentration.requirements:
					if requirement.fulfillsRequirement(course.id):
							requirement.increment()

				for requirement_set in concentration.specialRequirements:
					for requirement in requirement_set.valid:
						if requirement.fulfillsRequirement(course.id):
							requirement.increment()

		for course in self.courses:
			for req in self.standing.list:
				if req in course.geneds:
					req.increment()



	def hasTakenCourse(self, identifier):
		if ID(identifier) in self.courses:
			return True
		else:
			return False


	def addCourse(self, course):
		if not isinstance(course, Course):
			course = getCourse(course)
		self.courses.append(course)


	def addMajor(self, major):
		if not isinstance(major, Major):
			major = Major(major)
		self.majors.append(major)


	def addConcentration(self, concentration):
		if not isinstance(concentration, Concentration):
			concentration = Concentration(concentration)
		self.concentrations.append(concentration)

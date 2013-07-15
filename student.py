from major import Major
from concentration import Concentration

from course import Course, getCourse
from standing import Standing

def print_entire_list_as_english(passed_list):
	for i, item in enumerate(passed_list):
		if len(self.passed_list) is 1:
			output += item + " "

		elif len(self.passed_list) is 2:
			output += item
			if i is not (len(self.passed_list) - 1):
				output += " and "
			else:
				output += " "

		else:
			if i is not (len(self.passed_list) - 1):
				output += item + ", "
			else:
				output += "and " + item + ", "

class Student:
	name = ""
	start_year = 0
	end_year = 0

	majors = []
	concentrations = []
	courses = []
	standing = Standing()

	def __init__(self, name="", start_year=0, end_year=0, majors=[], concentrations=[], filename=""):
		if not filename:
			self.name = name
			self.start_year = int(start_year)
			self.end_year = int(end_year)


			self.addMajors(majors)
			self.addConcentrations(concentrations)
		else:
			previousHeading = ""
			with open(filename) as infile:
				for line in infile:
					if not previousHeading:
						previousHeading = "# NAME"

					if line[0] == '#':
						line = line.upper()
						previousHeading = line
						continue

					elif line:
						if line[0:2] == "//":
							# it's a comment
							pass

						elif previousHeading == "# NAME":
							self.name = line

						elif previousHeading == "# MAJORS":
							self.addMajor(line)

						elif previousHeading == "# CONCENTRATIONS":
							self.addConcentration(line)

						elif previousHeading == "# COURSES":
							self.addCourse(line)

						elif previousHeading == "# LABS":
							self.addCourse(line)


	def __eq__(self, other):
		return (
			self.name == other.name and
			self.start_year == other.start_year and
			self.end_year == other.end_year and
			self.majors == other.majors and
			self.concentrations == other.concentrations and
			self.courses == other.courses 
			# and
			# self.standing == other.standing
		)


	def __str__(self):
		self.updateStanding()
		output = ""
		output += self.name + ", "
		
		if self.majors:
			output += "you are majoring in "
			print_entire_list_as_english(self.majors)
		
		if self.concentrations:
			output += "with concentrations in "
			print_entire_list_as_english(self.concentrations)


		if self.majors:
			output += "while taking:" + '\n'
		else:
			output += "you are taking: " + '\n'


		for course in self.courses:
			output += c + '\n'

		output += '\n'

		# TODO: don't cout an extra line at the end of the output.

		output += "As such, you must fulfill these requirements to graduate: " + '\n'

		for major in self.majors:
			for requirement in major.requirements:
				output += requirement + '\n'

			for requirement_set in major.specialRequirements:
				for requirement in requirement_set.valid:
					output += req + '\n'

		for concentration in self.concentrations:
			for requirement in concentration.requirements:
				output += requirement + '\n'

			for requirement_set in concentration.specialRequirements:
				for requirement in requirement_set.valid:
					output += req + '\n'

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
				for requirement in major.requirements:
					if requirement.fulfillsRequirement(course.id):
						requirement.increment()

				for requirement_set in major.specialRequirements:
					for requirement in requirement_set.valid:
						if requirement.fulfillsRequirement(course.id):
							requirement.increment()


	def hasTakenCourse(self, identifier):
		courseID = ID(combined=identifier)
		if courseID in self.courses:
			return self.courses[courseID]
		else:
			return None


	def addCourse(self, course):
		if not isinstance(course, Course):
			course = Course(course)
		self.courses.append(course)

	def addMajor(self, major):
		if not isinstance(major, Major):
			major = Major(major)
		self.majors.append(major)

	def addConcentration(self, concentration):
		if not isinstance(concentration, Concentration):
			concentration = Concentration(concentration)
		self.concentrations.append(concentration)


if __name__ == '__main__':
	tmp = Student(name="Hawken", data="")
	other = tmp = Student(name="Hawken", data="")
	print(tmp)
	if tmp == other:
		print("equality success")

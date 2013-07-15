from major import Major
from concentration import Concentration

from course import Course, getCourse
from standing import Standing

def get_list_as_english(passed_list):
	output = ""
	for i, item in enumerate(passed_list):
		if len(passed_list) is 1:
			output += str(item)

		elif len(passed_list) is 2:
			output += str(item)
			if i is not (len(passed_list) - 1):
				output += " and "
			else:
				output += ""

		else:
			if i is not (len(passed_list) - 1):
				output += str(item) + ", "
			else:
				output += "and " + str(item) + ", "
	return output

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

			for major in majors:
				self.addMajor(major)
			for concentration in concentrations:
				self.addConcentration(concentration)

		else:
			heading = ""
			with open(filename) as infile:
				for line in infile:
					line = line.rstrip()
					if not heading:
						heading = "NAME"

					if line[0] == '#':
						line = line.upper()
						heading = line[2:]
						continue

					elif line:
						if line[0:2] == "//":
							# it's a comment
							pass

						elif heading == "NAME":
							self.name = line

						elif heading == "MAJORS":
							self.addMajor(line)

						elif heading == "CONCENTRATIONS":
							self.addConcentration(line)

						elif heading == "COURSES":
							# print(line)
							course = getCourse(line)
							self.standing.increment(course.credits)
							self.addCourse(line)

						elif heading == "LABS":
							course = getCourse(line)
							self.standing.increment(course.credits)
							self.addCourse(course)


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
		output = self.name + ", "
		
		if self.majors:
			output += "you are majoring in "
			output += get_list_as_english(self.majors)
		
		if self.concentrations:
			if len(self.concentrations) is 1:
				output += ", with a concentration in "
			else:
				output += ", with concentrations in "
			output += get_list_as_english(self.concentrations)
			output += ", "


		if self.majors:
			output += "while taking:" + '\n'
		else:
			output += "you are taking: " + '\n'


		for course in self.courses:
			output += str(course) + '\n'

		output += '\n'

		# TODO: don't cout an extra line at the end of the output.

		output += "As such, you must fulfill these requirements to graduate: " + '\n'

		for major in self.majors:
			for requirement in major.requirements:
				output += str(requirement) + '\n'

			for requirement_set in major.specialRequirements:
				for requirement in requirement_set.valid:
					output += str(requirement) + '\n'

		for concentration in self.concentrations:
			for requirement in concentration.requirements:
				output += str(requirement) + '\n'

			for requirement_set in concentration.specialRequirements:
				for requirement in requirement_set.valid:
					output += str(requirement) + '\n'

		output += '\n' + str(self.standing)

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


if __name__ == '__main__':
	tmp = Student(name="Hawken", data="")
	other = tmp = Student(name="Hawken", data="")
	print(tmp)
	if tmp == other:
		print("equality success")

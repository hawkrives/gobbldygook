from department import Department
from requirement import MajorRequirement, SpecialRequirement

class Major:
	def __init__(self, dept="NONE", path="majors/"):
		self.department = Department(dept)
		self.name = self.department.name()

		self.requirements = []
		self.specialRequirements = []
		self.setRequirements = []

		self.parse(path)

	def __str__(self):
		return self.name

	def __eq__(self, other):
		return (
			self.department == other.department and
			self.name == other.name and
			self.requirements == other.requirements and
			self.specialRequirements == other.specialRequirements and
			self.setRequirements == other.setRequirements
		)


	def parse(self, path):
		currentHeading = ""
		currentRequirement = ""
		
		with open(path + self.department.abbr() + ".txt") as infile:
			for line in infile:
				# Make sure that the string is uppercase
				line = line.upper()

				if not line:  # Skip the rest of this iteration of the loop because the line is blank
					continue

				elif line.startswith("#") and not line.startswith("##"):
					currentHeading = self.parseHeading(line)

				elif line.startswith("##"):
					currentRequirement = self.parseSubHeading(line, currentHeading)

				elif line.startswith("//"):
					pass

				self.parseContent(line, currentRequirement, currentHeading)


	def addMajorRequirement(self, req):
		self.requirements.append(req)
	def addSpecialRequirement(self, req):
		self.specialRequirements.append(req)
	def addSetRequirement(self, req):
		self.setRequirements.append(req)

	def getMajorRequirement(self, string):
		return self.requirements[string]
	def getSpecialRequirement(self, string):
		return self.specialRequirements[string]
	def getSetRequirement(self, string):
		return self.setRequirements[string]


	def parseContent(self, string, currentRequirement, currentHeading):
		if '=' in string:
			sides = self.parseContentLine(str)
			# print(sides)

			if sides[0] == "NAME":
				name = sides[1]


			elif sides[0] == "DEPARTMENT":
				department = Department(sides[1])


			elif sides[0] == "NEEDED":
				if currentHeading == "REQUIREMENTS":
					self.requirements[currentRequirement].setNeeded(int(sides[1]))
				elif currentHeading == "SPECIAL":
					self.specialRequirements[currentRequirement].setNeeded(int(sides[1]))
				elif currentRequcurrentHeadingirement == "SETS":
					self.setRequirements[currentRequirement].setNeeded(int(sides[1]))


			elif sides[0] == "VALIDCOURSES":
				validCourseList = sides[1].split(',')

				for courseID in validCourseList:
					if currentHeading == "REQUIREMENTS":
						self.requirements[currentRequirement].addCourse(ID(courseID))

					elif currentHeading == "SETS":
						self.setRequirements[currentRequirement].addCourse(ID(courseID))


			elif sides[0] == "VALIDSETS":
				validSetList = sides[1].split(',')
				# specialReq = self.specialRequirements[currentRequirement]

				for setID in validSetList:
					self.specialRequirements[currentRequirement].addSet(self.setRequirements[setID])


	def parseContentLine(self, string):
		# print(string)
		sides = string.split('=')
		for side in sides:
			side = side.strip()
		return sides


	def parseHeading(self, string):
		# We can assume that, if we are inside this block, there is only one octothorpe at the beginning of the line.

		string = string.strip('#')  # Remove the octothorpe
		string = string.strip()     # and whitespace

		return string


	def parseSubHeading(self, string, currentHeading):
		# Remove the octothorps from the beginning of the requirement title
		string = string.strip('#')

		# Remove any spaces from the beginning of the requirement title
		requirementTitle = string.strip()

		if currentHeading == "REQUIREMENTS":
			self.addMajorRequirement(MajorRequirement(requirementTitle))

		elif currentHeading == "SETS":
			self.addSpecialRequirement(SpecialRequirement(requirementTitle))

		elif currentHeading == "SPECIAL":
			# um, why are these MajorRequirements?
			self.addSetRequirement(MajorRequirement(requirementTitle))

		return requirementTitle


if __name__ == '__main__':
	tmp = [
		Major(dept="Asian")
	]
	for i in tmp:
		print(i)

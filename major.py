from department import Department
from requirement import MajorRequirement, SpecialRequirement, SetRequirement

import os
from yaml import load, dump
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

class Major:
	def __init__(self, dept="NONE", path="majors/"):
		self.department = Department(dept)
		self.name = self.department.name()

		self.requirements = []
		self.specialRequirements = []
		self.setRequirements = []

		filepath = (
			path + self.department.abbr() + ".yaml",
			path + self.department.abbr() + ".txt"
		)

		if os.path.isfile(filepath[0]):
			self.parseYAML(filepath[0])
		else:
			self.parseTXT(filepath[1])

	def __str__(self):
		return self.name

	def __eq__(self, other):
		if isinstance(other, Major):
			return (
				self.department == other.department 
				and self.name == other.name
				and self.requirements == other.requirements
				and self.specialRequirements == other.specialRequirements
				and self.setRequirements == other.setRequirements
			)
		else:
			return False


	def parseYAML(self, path):
		with open(path) as infile:
			data = load(infile, Loader=Loader)

			if 'name' in data:
				self.name = data['name']

			if 'dept' in data:
				self.department = Department(data['dept'])


			# print(data)

			if 'requirements' in data:
				for requirement_title in data['requirements']:
					req = data['requirements'][requirement_title]
					tmp = MajorRequirement(req['description'], req['needed'], req['valid'])
					# print(req['valid'])
					# print(tmp.valid)
					self.requirements.append(tmp)

			if 'special' in data:
				for requirement_title in data['special']:
					req = data['special'][requirement_title]
					print(req)
					tmp = SpecialRequirement(req['description'], req['needed'])
					for set_requirement in req['valid']:
						tmp.valid.append(SetRequirement(req['description'], req['needed'], req['valid']))
					print(tmp.valid)
					self.specialRequirements.append(tmp)



	def parseTXT(self, path):
		currentHeading = ""
		currentRequirement = ""
		
		with open(path) as infile:
			for line in infile:
				# Make sure that the string is uppercase
				line = line.upper()
				# print(line)

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
		if not isinstance(req, MajorRequirement):
			req = MajorRequirement(req)
		self.requirements.append(req)
		# self.requirements[req.name] = req

	def addSpecialRequirement(self, req):
		if not isinstance(req, SpecialRequirement):
			req = SpecialRequirement(req)
		self.specialRequirements.append(req)

	def addSetRequirement(self, req):
		if not isinstance(req, MajorRequirement):
			req = MajorRequirement(req)
		self.setRequirements.append(req)


	def getRequirement(self, req, passed_list):
		if req in passed_list:
			idx = passed_list.index(req)
			return passed_list[idx]
		else:
			return None

	def getMajorRequirement(self, string):
		req = MajorRequirement(string)
		return self.getRequirement(req, self.requirements)

	def getSpecialRequirement(self, string):
		req = SpecialRequirement(string)
		return self.getRequirement(req, self.specialRequirements)

	def getSetRequirement(self, string):
		req = MajorRequirement(string)
		return self.getRequirement(req, self.setRequirements)


	def parseContent(self, string, currentRequirement, currentHeading):
		if '=' in string:
			sides = self.parseContentLine(string)
			# print(sides)

			if sides[0] == "NAME":
				self.name = sides[1]


			elif sides[0] == "DEPARTMENT":
				self.department = Department(sides[1])


			elif "NEEDED" in sides[0]:
				if currentHeading == "REQUIREMENTS":
					self.getMajorRequirement(currentRequirement).needed = int(sides[1])
					# print(self.getMajorRequirement(currentRequirement))

				elif currentHeading == "SPECIAL":
					self.getSetRequirement(currentRequirement).needed = int(sides[1])
					# print(self.getSetRequirement(currentRequirement))

				elif currentHeading == "SETS":
					self.getSpecialRequirement(currentRequirement).needed = int(sides[1])
					# print(self.getSpecialRequirement(currentRequirement))


			elif sides[0] == "VALIDCOURSES":
				validCourseList = sides[1].split(',')

				for courseID in validCourseList:
					if currentHeading == "REQUIREMENTS":
						self.getMajorRequirement(currentRequirement).addCourse(courseID)

					elif currentHeading == "SETS":
						self.getSetRequirement(currentRequirement).addCourse(courseID)


			elif sides[0] == "VALIDSETS":
				# print("validsets")
				validSetList = sides[1].split(',')
				specialReq = self.getSpecialRequirement(currentRequirement)

				for setID in validSetList:
					specialReq.addSet(self.setRequirements[setID])


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

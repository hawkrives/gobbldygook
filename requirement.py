class Requirement:
	def __init__(self, title="", need=0):
		self.name = title
		self.needed = need
		self.has = 0
		self.satisfied = false
		self.checkSatisfied()

	def checkSatisfied(self):
		if self.has >= self.needed:
			self.satisfied = True
		else:
			self.satisfied = False

	def incrementHas(self):
		self.has += 1
		self.checkSatisfied()

	def decrementHas(self):
		self.has -= 1
		self.checkSatisfied()

	def __str__(self):
		if self.satisfied:
			ostream = "\u2705"
		else:
			ostream = "\u274C"

		ostream += "  " + self.name + " needs " + str(self.needed)

		if self.satisfied:
			ostream += ", and has "
		else:
			ostream += ", but has "

		ostream += str(self.has) + "."

		return ostream


class MajorRequirement(Requirement):
	validCourses = []

	def __init__(self, title="", need=0):
		super().__init__(title, need)

	def addCourse(course):
		self.validCourses.append(course)

	def fulfillsRequirement(course):
		return course in self.validCourses


class SpecialRequirement(Requirement):
	validSets = []

	def __init__(self, title="", need=0):
		super().__init__(title, need)

	def addCourse(course):
		self.validSets.append(course)

	def fulfillsRequirement(course):
		return course in self.validSets


if __name__ == '__main__':
	tmp = [
		Requirement("Semester in Asia"),
		Requirement("Semester in Japan", 1),
		MajorRequirement("Major Req", 1),
		SpecialRequirement("Special Req")
	]
	for i in tmp:
		print (i)

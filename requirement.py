class Requirement:
	def __init__(self, name="", needed=0):
		self.name = name
		self.needed = needed
		self.has = 0
		self.satisfied = False
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

	def __eq__(self, other):
		return (
			self.name == other.name and
			self.needed == other.needed and
			self.has == other.has and
			self.satisfied == other.satisfied
		)

	def __hash__(self):
		return hash(
			self.name and self.needed and self.has and self.satisfied 
		)


class RequirementWithValididty(Requirement):
	def __init__(self, name="", needed=0):
		super().__init__(name, needed)
		self.valid = []

	def __eq__(self, other):
		return (
			super().__eq__(other) and
			self.valid == other.valid
		)

	def addCourse(course):
		self.valid.append(course)

	def fulfillsRequirement(course):
		return course in self.valid


class MajorRequirement(RequirementWithValididty):
	def __init__(self, name="", needed=0):
		super().__init__(name, needed)


class SpecialRequirement(RequirementWithValididty):
	def __init__(self, name="", needed=0):
		super().__init__(name, needed)


if __name__ == '__main__':
	tmp = [
		Requirement("Semester in Asia"),
		Requirement("Semester in Japan", 1),
		MajorRequirement("Major Req", 1),
		SpecialRequirement("Special Req"),
		Requirement("Semester in Asia"),
	]
	for i in tmp:
		print (i)

	if tmp[0] == tmp[4]:
		print("success")

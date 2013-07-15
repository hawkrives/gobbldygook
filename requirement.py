from ID import ID

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

	def increment(self):
		self.has += 1
		self.checkSatisfied()

	def decrement(self):
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

	def addCourse(self, identifier):
		if not isinstance(identifier, ID):
			identifier = ID(combined=identifier)
		self.valid.append(identifier)

	def fulfillsRequirement(self, identifier):
		return identifier in self.valid


class MajorRequirement(RequirementWithValididty):
	def __init__(self, name="", needed=0):
		super().__init__(name, needed)


class SpecialRequirement(RequirementWithValididty):
	def __init__(self, name="", needed=0):
		super().__init__(name, needed)


gened_t = {
	# Foundation Studies
	"FYW": "First-Year Writing",
	"WRI": "Writing in Context",
	"FOL": "Foreign Language",
	"ORC": "Oral Communication",
	"AQR": "Abstract and Quantitative Reasoning",
	"SPM": "Studies in Physical Movement",

	# Core Studies
	"HWC": "Historical Studies in Western Culture",
	"MCD": "Multicultural Studies: Domestic",
	"MCG": "Multicultural Studies: Global",
	"ALSA": "Artistic and Literary Studies: Artistic Studies",
	"ALSL": "Artistic and Literary Studies: Literary Studies",
	"BTSB": "Biblical and Theological Studies: Bible",
	"BTST": "Biblical and Theological Studies: Theology",
	"SED": "Studies in Natural Science: Scientific Exploration and Discovery",
	"IST": "Studies in Natural Science: Integrated Scientific Topics",
	"HBS": "Studies in Human Behavior and Society",

	# Integrative Studies
	"EIN": "Ethical Issues and Normative Perspectives"
}


class GenEd(Requirement):
	def __init__(self, name="", needed=0):
		super().__init__(name, needed)

	def __eq__(self, other):
		if isinstance(other, str):
			return (self.name.upper() == other.upper())
		else:
			return (self.name == other.name)

	def hash(self):
		return hash(self.name)


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

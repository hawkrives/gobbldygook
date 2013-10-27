from ID import ID
from helpers import tidy_float, get_readable_list

class Requirement:
	def __init__(self, name="", needed=0):
		self.name = name
		self.needed = needed
		self.has = 0
		self.satisfied = False
		self.satisfied_by = []

	def check_satisfied(self):
		if self.has >= self.needed:
			self.satisfied = True
		else:
			self.satisfied = False
		return self.satisfied

	def increment(self, by, course_id):
		self.has += by
		self.satisfied_by.append(course_id)

	def __str__(self, append=""):
		self.check_satisfied()

		if self.satisfied:
			output = '\u2705'
		elif self.has > 0:
			output = '\u2B55'
		else:
			output = '\u274C'

		output += "  '" + self.name + "' needs " + str(self.needed)

		if self.satisfied:
			output += ", and has "
		else:
			output += ", but has "

		output += str(tidy_float(self.has)) + "."

		output += append

		return output


	def __eq__(self, other):
		if isinstance(other, Requirement):
			return (
				self.name == other.name
				and self.needed == other.needed
				and self.has == other.has
				and self.satisfied == other.satisfied
			)
		else:
			return False

	def __lt__(self, other):
		return self.name < other.name


	def __hash__(self):
		return hash(self.name and self.needed and self.has and self.satisfied)


class MajorRequirement(Requirement):
	def __init__(self, name="", needed=0, valid=[]):
		super().__init__(name, needed)
		self.valid = valid

	def __eq__(self, other):
		if isinstance(other, MajorRequirement):
			return (
				super().__eq__(other)
				and self.valid == other.valid
			)
		else:
			return False

	def __iter__(self):
		return self.valid.__iter__()

	def __str__(self):
		output = ""
		if self.satisfied_by and not self.check_satisfied():
			output += ' ['
			output += get_readable_list(self.satisfied_by)
			output += ']'
		output = super().__str__(output)
		return output

	def add_course(self, identifier):
		if not isinstance(identifier, ID):
			identifier = ID(combined=identifier)
		self.valid.append(identifier)

	def check_requirement(self, identifier):
		if identifier in self.valid:
			self.increment(1.0, identifier)


class SetRequirement(MajorRequirement):
	def __init__(self, name="", needed=0, valid=[]):
		super().__init__(name, needed, valid)


class SpecialRequirement(Requirement):
	def __init__(self, name="", needed=0, requirements=[]):
		super().__init__(name, needed)
		self.requirements = []
		for set_req in requirements:
			self.requirements.append(SetRequirement(set_req['description'], set_req['needed'], set_req['valid']))

	def __eq__(self, other):
		if isinstance(other, SpecialRequirement):
			return (
				super().__eq__(other)
				and self.requirements == other.requirements
			)
		else:
			return False

	def add_set(self, identifier):
		self.requirements.append(identifier)

	def check_requirement(self, identifier):
		for requirement in self.requirements:
			# There was a problem where, once a requirement was completed, the SpecialRequirement would be incremented every iteration of the loop afterwards. Taking the initial status of the requirement and checking against it at the end solves that.

			# Take the initial status of a requirement
			initial_status = requirement.check_satisfied()

			if identifier in requirement.valid:
				requirement.increment(1.0, identifier)

			# Check against the initial status of the requirement
			if requirement.check_satisfied() != initial_status:
				self.increment(1.0, identifier)



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
	"ALS-A": "Artistic and Literary Studies: Artistic Studies",
	"ALS-L": "Artistic and Literary Studies: Literary Studies",
	"BTS-B": "Biblical and Theological Studies: Bible",
	"BTS-T": "Biblical and Theological Studies: Theology",
	"SED": "Studies in Natural Science: Scientific Exploration and Discovery",
	"IST": "Studies in Natural Science: Integrated Scientific Topics",
	"HBS": "Studies in Human Behavior and Society",

	# Integrative Studies
	"EIN": "Ethical Issues and Normative Perspectives",

	# Foreign Languages
	"FOL-F": "Foreign Language: French",
	"FOL-G": "Foreign Language: German",
	"FOL-S": "Foreign Language: Spanish",
	"FOL-C": "Foreign Language: Chinese",
	"FOL-K": "Foreign Language: Greek",
	"FOL-L": "Foreign Language: Latin",
	"FOL-J": "Foreign Language: Japanese",
	"FOL-N": "Foreign Language: Norwegian",
	"FOL-R": "Foreign Language: Russian"
}

fol_t = {
	# Foreign Languages
	"FOL-F": "Foreign Language: French",
	"FOL-G": "Foreign Language: German",
	"FOL-S": "Foreign Language: Spanish",
	"FOL-C": "Foreign Language: Chinese",
	"FOL-K": "Foreign Language: Greek",
	"FOL-L": "Foreign Language: Latin",
	"FOL-J": "Foreign Language: Japanese",
	"FOL-N": "Foreign Language: Norwegian",
	"FOL-R": "Foreign Language: Russian"
}


class GenEd(Requirement):
	def __init__(self, name="", needed=0):
		super().__init__(name, needed)
		self.description = gened_t[name]

	def __eq__(self, other):
		if isinstance(other, str):
			return self.name.upper() == other.upper()
		elif isinstance(other, Requirement):
			return self.name == other.name
		else:
			return False

	def __hash__(self):
		return hash(self.name)

	def __str__(self):
		return super().__str__() + '\t(' + self.description + ')'


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

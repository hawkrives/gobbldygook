from requirement import GenEd
from helpers import get_readable_list, tidy_float

class Standing:
	def __init__(self, credits_needed=35, credits_taken=0.0):
		self.credits_needed = credits_needed
		self.credits_taken = credits_taken

		# Students must satisfactorily complete the fourth college semester
		# course (numbered 232 or higher) taught in the French [FOL-F], German
		# [FOL-G], or Spanish [FOL-S] languages; or the third college semester
		# course (numbered 231 or higher) taught in the Chinese [FOL-C], Greek
		# [FOL-K], Latin [FOL-L], Japanese [FOL-J], Norwegian [FOL-N], or
		# Russian [FOL-R] languages, or demonstrate equivalent proficiency.

		self.geneds = {
			"FYW": GenEd("FYW", 1),
			"WRI": GenEd("WRI", 4),
			"FOL": GenEd("FOL", 1),
			"ORC": GenEd("ORC", 1),
			"AQR": GenEd("AQR", 1),
			"SPM": GenEd("SPM", 2),
			"HWC": GenEd("HWC", 1),
			# TODO: support requiring that courses be from different departments
			"MCG": GenEd("MCG", 1),
			"MCD": GenEd("MCD", 1),
			"ALS-A": GenEd("ALS-A", 1),
			"ALS-L": GenEd("ALS-L", 1),
			"BTS-B": GenEd("BTS-B", 1),
			"BTS-T": GenEd("BTS-T", 1),
			"SED": GenEd("SED", 1),
			"IST": GenEd("IST", 1),
			"HBS": GenEd("HBS", 1),
			"EIN": GenEd("EIN", 1)
		}

	def increment(self, by=1):
		self.credits_taken += by

	def check_standing(self):
		return self.credits_taken >= self.credits_needed

	def __str__(self):
		self.check_standing()
		output = "You have " + str(tidy_float(self.credits_taken)) + " credits "
		output += "out of " + str(self.credits_needed) + " credits needed to graduate."
		output += '\n'

		output += get_readable_list(self.geneds, sep='\n', end='')
		return output


if __name__ == '__main__':
	tmp = [
		Standing()
	]
	for i in tmp:
		print(i)

	if "FYW" in tmp[0].geneds:
		print("success")

from requirement import GenEd
from helpers import get_readable_list

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

		self.list = [
			GenEd("FYW", 1),
			GenEd("WRI", 4),
			# TODO: Support requirements that have a variable number of courses needed.
			GenEd("FOL", 4),
			GenEd("FOL-F", 4),
			GenEd("FOL-G", 4),
			GenEd("FOL-S", 4),
			GenEd("FOL-C", 3),
			GenEd("FOL-K", 3),
			GenEd("FOL-L", 3),
			GenEd("FOL-J", 3),
			GenEd("FOL-N", 3),
			GenEd("FOL-R", 3),
			GenEd("ORC", 1),
			GenEd("AQR", 1),
			# TODO: support using 'number of courses' instead of 'number of credits'
			# I think this one is solved — antually, the situation might be reversed...
			GenEd("SPM", 2),
			GenEd("HWC", 1),
			# TODO: support requiring that courses be from different departments
			GenEd("MCG", 1),
			GenEd("MCD", 1),
			GenEd("ALS-A", 1),
			GenEd("ALS-L", 1),
			GenEd("BTS-B", 1),
			GenEd("BTS-T", 1),
			GenEd("SED", 1),
			GenEd("IST", 1),
			GenEd("HBS", 1),
			GenEd("EIN", 1)
		]

	def increment(self, i=1):
		self.credits_taken += i

	def checkStanding(self):
		return self.credits_taken >= self.credits_needed

	def __str__(self):
		self.checkStanding()
		output = "You have " + str(self.credits_taken) + " credits "
		output += "out of " + str(self.credits_needed) + " credits needed to graduate."
		output += '\n'

		output += get_readable_list(self.list, sep='\n', end='')
		return output


if __name__ == '__main__':
	tmp = [
		Standing()
	]
	for i in tmp:
		print(i)

	if "FYW" in tmp[0].list:
		print("success")

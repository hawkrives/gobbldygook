from department import Department
import re

class ID:
	def __init__(self, dept='', num=0, sec='', combined=''):
		if not combined:
			self.department = Department(dept)
			self.number = int(num)
		else:
			regex = "(?i)(([a-z]*)(?=/)(/)([a-z]*)|[a-z]*) *(\d*)"
			replace = "\g<1> \g<5>"
			result = re.sub(regex, replace, combined)
			sides = result.split()
			self.department = Department(sides[0])
			self.number = int(sides[1])

		self.section = sec


	def __str__(self):
		return str(self.department) + " " + str(self.number) + self.section
		# return self.section


	def __eq__(self, other):
		return (
				self.department == other.department and
				self.number == other.number #and
				# self.section == other.section
			)

	def __hash__(self):
		return hash(str(self.department) + " " + str(self.number))


if __name__ == '__main__':
	ids = [
		ID("AS/RE", 121, 'A'),
		ID(combined="AS/HI121", sec='B')
	]
	for i in ids:
		print(i)

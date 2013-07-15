from department import Department
import re

class ID:
	def __init__(self, combined='', dept='', number=0, section=''):
		if not combined:
			self.department = Department(dept)
			self.number = int(number)
			self.section = section
		else:
			regex = "(?P<dept>([a-z]*)(?=/)(/)([a-z]*)|[a-z]*) *(?P<num>[0-9]*) *(?P<sec>[a-z]*)"
			match = re.search(regex, combined, re.I | re.S)
			result = match.groupdict()
			self.department = Department(result["dept"])
			self.number = int(result["num"])
			if not section:
				self.section = result["sec"]
			else:
				self.section = section

	def __str__(self):
		return str(self.department) + " " + str(self.number) + self.section

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
		ID(combined="AS/HI121", sec='B'),
		ID("AS/RE", 121, 'A')
	]
	for i in ids:
		print(i)
	if ids[0] == ids[2]:
		print("success")

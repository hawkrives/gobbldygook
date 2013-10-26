from department import Department
import re

class ID:
	def __init__(self, combined='', dept='', number=0, section=''):
		if not combined:
			self.department = Department(dept)
			self.number = int(number)
			self.section = section
		else:
			combined = combined.upper()
			regex = r"(?P<dept>([a-z]*)(?=/)(/)([a-z]*)|[a-z]*) *(?P<num>[0-9]*) *(?P<sec>[a-z]*)"
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
		if isinstance(other, ID):
			return (
					self.department == other.department
					and self.number == other.number 
					and self.section == other.section
				)
		elif isinstance(other, str):
			return str(self.department) + " " + str(self.number) == other
		else:
			return False

	def __hash__(self):
		return hash(str(self.department) + " " + str(self.number))


if __name__ == '__main__':
	ids = [
		ID(dept="AS/RE", number=121, section='A'),
		ID(combined="AS/HI121B"),
		ID(dept="AS/RE", number=121, section='A'),
		ID("AS/HI121B"),
		ID("AS/HI 121B"),
		ID("AS/HI 121 B"),
		ID("Religion 121L"),
		ID("Religion121L"),
		ID("RE121L"),
		ID("Rel121L"),
		ID("REL121")
	]

	for i in ids:
		print(i)

	if ID("REL121L") == "REL 121":
		print('yes')

	if ID("Religion 121L") == ID("REL 121L"):
		print("they matched")

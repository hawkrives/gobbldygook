from department import Department
from requirement import MajorRequirement, SpecialRequirement

import os
from yaml import load
try:
	from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
	from yaml import Loader, Dumper

class Major:
	def __init__(self, dept="NONE", folder="majors/"):
		self.department = Department(dept)
		self.name = self.department.name()

		self.requirements = []
		self.special_requirements = []
		self.set_requirements = []

		filepath = folder + self.department.abbr() + ".yaml"

		if os.path.isfile(filepath):
			self.parse_yaml(filepath)
		else:
			print("Could not find major", dept)

	def __str__(self):
		return self.name

	def __eq__(self, other):
		if isinstance(other, Major):
			return (
				self.department == other.department 
				and self.name == other.name
				and self.requirements == other.requirements
				and self.special_requirements == other.special_requirements
				and self.set_requirements == other.set_requirements
			)
		else:
			return False


	def parse_yaml(self, path):
		with open(path) as infile:
			data = load(infile, Loader=Loader)

			if 'name' in data:
				self.name = data['name']

			if 'dept' in data:
				self.department = Department(data['dept'])

			if 'requirements' in data:
				for requirement_title in data['requirements']:
					req = data['requirements'][requirement_title]
					major_req = MajorRequirement(req['description'], req['needed'], req['valid'])
					self.requirements.append(major_req)

			if 'special' in data:
				for requirement_title in data['special']:
					req = data['special'][requirement_title]
					special_req = SpecialRequirement(req['description'], req['needed'], req['valid'])
					self.special_requirements.append(special_req)


if __name__ == '__main__':
	tmp = [
		Major(dept="Asian")
	]
	for i in tmp:
		print(i)

from major import Major
from ID import ID
# from gened import GenEd

course_t = {
	"LAB": "Lab",
	"DISCUSSION": "Discussion",
	"SEMINAR": "Seminar",
	"TOPIC": "Topic",
	"COURSE": "Course"
}

class Course:
	def __init__(self, data=[]):
		# Ignore the first column, because all it contains is whether the cours is open or closed.
		# data[0]

		# so, the *first* column (that we care about) has the course id,
		# and the second column has the section,
		self.id = ID(combined=data[1], sec=data[2])

		# Third holds the lab boolean,
		if   data[3] == "L": self.courseType = course_t["LAB"]
		elif data[3] == "S": self.courseType = course_t["SEMINAR"]
		elif data[3] == "D": self.courseType = course_t["DISCUSSION"]
		elif data[3] == "T": self.courseType = course_t["TOPIC"]
		else:                self.courseType = course_t["COURSE"]

		# while Fourth contains the title of the course
		self.title = self.cleanTitle(data[4])
		# self.title = data[4]

		# Fifth hands over the length (half semester or not)
		# It is actually an int that tells us how many times the course is offered per semester.
		self.half_semester = 0
		if data[5]:
			self.half_semester = int(data[5])
		if (self.half_semester is not 0) and (self.half_semester is not 1) and (self.half_semester is not 2):
			self.half_semester = 0

		# Sixth tells us the number of credits,
		self.credits = float(data[6])

		# Seventh shows us if it can be taken pass/no-pass, 
		if data[7] == "Y":
			self.pass_fail = True
		else:
			self.pass_fail = False

		# while Eighth gives us the GEs of the course,
		self.geneds = data[8]

		# and Nine spits out the days and times
		self.times = data[9]

		# Ten holds the location,
		self.location = data[10]

		# and Eleven knows who teaches.
		self.professor = data[11]

	def __eq__(self, other):
		return (
			self.id == other.id and
			self.courseType == other.courseType and
			self.title == other.title and
			self.half_semester == other.half_semester and
			self.credits == other.credits and
			self.pass_fail == other.pass_fail and
			self.geneds == other.geneds and
			self.times == other.times and
			self.location == other.location and
			self.professor == other.professor
		)

	def __hash__(self):
		return hash(
			self.id and
			self.courseType and
			self.title and
			self.half_semester and
			self.credits and
			self.pass_fail and
			self.geneds and
			self.times and
			self.location and
			self.professor
		)


	def cleanTitle(self, string):
		badEndings = [
			" Admission by",
			" Class will",
			" Closed",
			" During course submission process",
			" Especially for ",
			" Enrollment by",
			" Film screenings",
			" First-years "
			" First-Year Students",
			" Focuses on",
			" Lab times to be arranged.",
			" Limited to",
			" New course",
			" Not open to first-year students.",
			" Note:",
			" No prerequisite",
			" Nursing ",
			" Only open ",
			" Open only ",
			" Open to ",
			" Discuss",
			" Permission of ",
			" Please note ",
			" Prereq",
			" Registration",
			" Taught in English.",
			" The focus of this course",
			" Thyis is an",
			" This is an",
			" This course",
			" This lab has been canceled.",
			" Students in ",
			" You may "
		]

		badBeginnings = [
			"Top: ",
			"Sem: ",
			"Res: "
		]

		for ending in badEndings:
			string = string.split(ending)[0]

		for beginning in badBeginnings:
			if beginning in string:
				string = string.split(beginning)[1]

		# if (str(self.id.department) + " " + str(self.id.number)) in string:
			# print(string.split(str(self.id.department) + " " + str(self.id.number)))

		string.strip()

		return string


	def getProfessor(self):
		return self.professor
	def getID(self):
		return self.id
	def getType(self):
		return self.courseType

	def getDepartment():
		return self.id.department
	def getNumber(self):
		return self.id.number
	def getSection(self):
		return self.id.section

	def __str__(self):
		ostream = self.getType() + ": "
		ostream += str(self.id.department) + " " + str(self.id.number) + self.id.section
		ostream += " - "
		ostream += self.title + " | "
		if (len(self.professor) and (self.professor != " ")):
			ostream += self.professor
		return ostream

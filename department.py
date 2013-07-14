import collections

dept_t = {
	"AFAM":  "Africa and the Americas",
	"ALSO":  "Alternate Language Study Option",
	"AMCON": "American Conversation",
	"AMST":  "American Studies",
	"ARMS":  "American Racial and Multicultural Studies",
	"AR":    "Art and Art History",
	"ART":   "Art and Art History",
	"AS":    "Asian Studies",
	"ASIAN": "Asian Studies",
	"BI":    "Biology",
	"BIO":   "Biology",
	"BMOLS": "Biomolecular Science",
	"CH":    "Chemistry",
	"CHEM":  "Chemistry",
	"CHIN":  "Chinese",
	"CLASS": "Classics",
	"CSCI":  "Computer Science",
	"DANCE": "Dance",
	"EC":    "Economics",
	"ECON":  "Economics",
	"EDUC":  "Education",
	"ENGL":  "English",
	"ES":    "Environmental Studies",
	"ENVST": "Environmental Studies",
	"ESAC":  "Exercise Science Activity",
	"ESTH":  "Exercise Science Theory",
	"FAMST": "Family Studies",
	"FILM":  "Film Studies",
	"FREN":  "French",
	"GCON":  "Great Conversation",
	"GERM":  "German",
	"GREEK": "Greek",
	"HI":    "History",
	"HIST":  "History",
	"HSPST": "Hispanic Studies",
	"ID":    "Interdisciplinary",
	"IDFA":  "IDFA",
	"INTD":  "Interdepartmental",
	"IS":    "Integrative Studies",
	"JAPAN": "Japanese",
	"LATIN": "Latin",
	"MATH":  "Mathematics",
	"MEDIA": "Media Studies",
	"MEDVL": "Medieval Studies",
	"MGMT":  "Management Studies",
	"MU": "Music",
	"MUSIC": "Music",
	"MUSPF": "Music Performance",
	"NEURO": "Neuroscience",
	"NORW":  "Norwegian",
	"NURS":  "Nursing",
	"PH":    "Philosphy",
	"PHIL":  "Philosphy",
	"PHYS":  "Physics",
	"PS":    "Political Science",
	"PSCI":  "Political Science",
	"PSYCH": "Psychology",
	"RE":    "Religion",
	"REL":   "Religion",
	"RUSST": "Russian Studies",
	"RUSSN": "Russian Studies",
	"SCICN": "Science Conversation",
	"SA":    "Sociology and Anthropology",
	"SOAN":  "Sociology and Anthropology",
	"SPAN":  "Spanish",
	"STAT":  "Statistics",
	"SWRK":  "Social Work",
	"THEAT": "Theater",
	"WMNST": "Women's Studies",
	"WMGST": "Women's & Gender Studies",
	"WRIT":  "Writing",
	"NONE":  "Unknown Department"
}

class Department(collections.MutableSequence):
	def __init__(self, name):
		self.list = list()
		name = name.upper()
		if '/' in name:
			self.list.append((name[0:2], dept_t[name[0:2]]))
			self.list.append((name[3:5], dept_t[name[3:5]]))
		else:
			self.list.append((name, dept_t[name]))

	def name(self, i=0):
		return self.list[i][1]

	def abbr(self, i=0):
		return self.list[i][0]

	def __len__(self):
		return len(self.list)

	def __getitem__(self, i): 
		return self.list[i]

	def __delitem__(self, i): 
		del self.list[i]

	def __setitem__(self, i, v):
		self.list[i] = v

	def insert(self, i, v):
		self.list.insert(i, v)

	def __eq__(self, other):
		return self.list == other.list

	def __hash__(self):
		return hash(self.list)

	def __str__(self):
		if len(self.list) is 1:
			return self.abbr(0)

		elif len(self.list) is 2:
			return self.abbr(0) + '/' + self.abbr(1)

		else:
			print("Something weird just happened in Department: ")
			print("list is ", self.list)


if __name__ == '__main__':
	tmp = (
		Department("AS/RE"),
		Department("ASIAN")
	)
	for i in tmp:
		print(i)

import collections, re

dept = {
	"AFAM":  "Africa and the Americas",
	"ALSO":  "Alternate Language Study Option",
	"AMCON": "American Conversation",
	"AMST":  "American Studies",
	"ARMS":  "American Racial and Multicultural Studies",
	"ART":   "Art and Art History",
	"ASIAN": "Asian Studies",
	"BIO":   "Biology",
	"BMED":  "Biomedical Studies",
	"BMOLS": "Biomolecular Science",
	"CHEM":  "Chemistry",
	"CHIN":  "Chinese",
	"CLASS": "Classics",
	"CSCI":  "Computer Science",
	"DANCE": "Dance",
	"ECON":  "Economics",
	"EDUC":  "Education",
	"ENGL":  "English",
	"ENVST": "Environmental Studies",
	"ESAC":  "Exercise Science Activity",
	"ESTH":  "Exercise Science Theory",
	"FAMST": "Family Studies",
	"FILM":  "Film Studies",
	"FREN":  "French",
	"GCON":  "Great Conversation",
	"GERM":  "German",
	"GREEK": "Greek",
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
	"MUSIC": "Music",
	"MUSPF": "Music Performance",
	"MSCS":  "Math/Stat/CSci",
	"NEURO": "Neuroscience",
	"NORW":  "Norwegian",
	"NURS":  "Nursing",
	"PHIL":  "Philosphy",
	"PHYS":  "Physics",
	"PSCI":  "Political Science",
	"PSYCH": "Psychology",
	"REL":   "Religion",
	"RUSST": "Russian Studies",
	"RUSSN": "Russian Studies",
	"SCICN": "Science Conversation",
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

dept_reversed = {desc:dept for dept, desc in dept.items()}

dept_short = {
	"AR": "ART",
	"AS": "ASIAN",
	"BI": "BIO",
	"CH": "CHEM",
	"EC": "ECON",
	"ES": "ENVST",
	"HI": "HIST",
	"MU": "MUSIC",
	"PH": "PHIL",
	"PS": "PSCI",
	"RE": "REL",
	"SA": "SOAN"
}

class Department(collections.MutableSequence):
	def __init__(self, name):
		self.list = list()
		name = name.upper()

		# If the name is short
		if len(name) is 2 and name != "ID" and name != "IS":
			self.list.append((dept_short[name], dept[dept_short[name]]))

		# If the name is long
		elif name not in dept and (len(name) > 5 or '/' not in name):
			name = name.title()
			self.list.append((dept_reversed[name], name))

		# If the name is *just right*
		else:
			if '/' in name and len(name) == 5:
				self.list.append((dept_short[name[0:2]], dept[dept_short[name[0:2]]]))
				self.list.append((dept_short[name[3:5]], dept[dept_short[name[3:5]]]))
			elif '/' in name:
				result = re.match(r"(.*)/(.*)", name).groups()
				self.list.append((result[0], dept[result[0]]))
				self.list.append((result[1], dept[result[1]]))
			else:
				self.list.append((name, dept[name]))


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
		if isinstance(other, Department):
			return self.list == other.list
		else:
			return False

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
		Department("ASIAN"),
		Department("RE")
	)
	for i in tmp:
		print(i.name())

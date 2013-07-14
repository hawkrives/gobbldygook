import argparse, csv

from course import Course
from ID import ID
# import student

def argument_parse():
	parser = argparse.ArgumentParser(description="This program works best if you give it some data. However, we have some example stuff to show you anyway.)")
	parser.add_argument('-l', "--load")
	parser.add_argument('-f', "--find")
	parser.add_argument("--demo")
	parser.add_argument("--stress")
	parser.add_argument("--debug")
	return parser


all_courses = {}

def getCourse(identifier):
	courseID = ID(combined=identifier)

	if courseID in all_courses:
		return all_courses[courseID]
	else:
		return None


def loadCourses(filename):
	global all_courses
	with open(filename) as infile:
		# print(filename)
		infile.readline()
		csvfile = csv.reader(infile)
		for i, row in enumerate(csvfile):
			tmp = Course(data=row)
			# print(tmp)
			all_courses[tmp.id] = tmp


def readData():
	loadCourses("data/2012-13-s2.csv")
	loadCourses("data/2012-13-interim.csv")
	loadCourses("data/2012-13-s1.csv")

	loadCourses("data/2011-12-s2.csv")
	loadCourses("data/2011-12-interim.csv")
	loadCourses("data/2011-12-s1.csv")

	loadCourses("data/2010-11-s2.csv")
	loadCourses("data/2010-11-interim.csv")
	loadCourses("data/2010-11-s1.csv")


def main():
	# parser = argument_parse()
	# args = parser.parse_args()

	readData()

	print(getCourse("WMNST 298"))
	print(getCourse("JAPAN 112"))

	# for course in all_courses:
		# print(all_courses[course])

if __name__ == '__main__':
	main()

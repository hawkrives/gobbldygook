import argparse, csv
#!/usr/local/bin/python3

from course import Course, all_courses
from student import Student

def argument_parse():
	parser = argparse.ArgumentParser(description="This program works best if you give it some data. However, we have some example stuff to show you anyway.)")
	parser.add_argument('-l', "--load", default='users/example.txt')
	parser.add_argument('-f', "--find")
	parser.add_argument("--demo")
	parser.add_argument("--stress")
	parser.add_argument("--debug")
	return parser


def loadCourses(filename):
	with open(filename) as infile:
		infile.readline()
		csvfile = csv.reader(infile)
		for i, row in enumerate(csvfile):
			tmp = Course(data=row)
			all_courses[tmp.id] = tmp
			# print(tmp)


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
	parser = argument_parse()
	args = parser.parse_args()
	print(args.load)

	readData()

	user = Student(filename=args.load)

	print(user)


if __name__ == '__main__':
	main()

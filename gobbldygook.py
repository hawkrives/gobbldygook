#!/usr/local/bin/python3

from course import Course, all_courses
import argparse, csv, os
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




def read_data():
	path = 'data/'
	for filename in os.listdir(path):
		if filename[0] is not '.':
			# print(filename)
			load_data(path + filename)


def main():
	parser = argument_parse()
	args = parser.parse_args()
	print(args.load)

	read_data()

	user = Student(filename=args.load)

	print(user)


if __name__ == '__main__':
	main()

#!/usr/bin/env python3

import argparse, csv, os

from course import Course, all_courses, all_labs
from student import Student

def argument_parse():
	parser = argparse.ArgumentParser(description="This program works best if you give it some data. However, we have some example stuff to show you anyway.)")
	parser.add_argument('-l', "--load", default='rives')
	parser.add_argument('-f', "--find")
	parser.add_argument("--demo")
	parser.add_argument("--stress")
	parser.add_argument("--debug")
	return parser


def parse_filename(fname):
	filename = fname.name
	filename = filename.split('.')[0] # Remove the extension
	filename = filename.split('/')[1] # Remove the path seperator

	start_year, end_year, semester = filename.split(sep='-')

	if semester == 's1':
		semester = "fall"
	elif semester == 's2':
		semester = "spring"
	elif semester == 'ss1':
		semester = "summer session 1"
	elif semester == 'ss2':
		semester = "summer session 2"

	return int(filename[0:4]), semester


def load_data(filename):
	with open(filename) as infile:
		year, semester = parse_filename(infile)

		if year not in all_courses:
			all_courses[year] = {}
		if semester not in all_courses[year]:
			all_courses[year][semester] = {}

		infile.readline() # Remove the csv header line
		csvfile = csv.reader(infile)
		for row in csvfile:
			tmp = Course(data=row)
			if tmp.course_status == 'X':
				pass
			elif tmp.course_type == "Lab":
				all_labs[tmp.id] = tmp
			else:
				all_courses[tmp.id] = tmp
				all_courses[year][tmp.id] = tmp
				all_courses[year][semester][tmp.id] = tmp


def read_data():
	path = 'data/'
	for filename in os.listdir(path):
		if filename[0] is not '.':
			load_data(path + filename)


def main():
	parser = argument_parse()
	args = parser.parse_args()

	read_data()

	user = Student(filename='users/'+args.load+'.yaml')
	print(user)


if __name__ == '__main__':
	main()

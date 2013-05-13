#include "data-general.hpp"
#include "data-course.hpp"
#include "data-student.hpp"
using namespace std;

vector<Course> all_courses;
map<ID, Course> mapped_courses;
Student user;

void loadCourses() {
	ifstream infile("data/2012-13-s2-csv.csv");
	string str; // read in the header line
	getline(infile, str);
	while (infile.peek() != -1){
		Course incourse(infile);
		all_courses.push_back(incourse);
		mapped_courses.insert(pair<ID, Course>(incourse.getID(), incourse));
		// cout << incourse << endl;
	}
	// for (vector<Course>::iterator c = all_courses.begin(); c != all_courses.end(); ++c)
	// 	if (c->getProfessor()[1] == ' ')
	// 		if (c->getProfessor()[2] == '0' || c->getProfessor()[2] == '1')
	// 			c->displayMany();
}

void welcome() {
	string name, yearS = "", yearE = "", majors;
	cout << "Welcome!" << endl;
	cout << "What is your name? ";
	getline(cin, name);
	cout << "What year do you graduate? ";
	getline(cin, yearE);
	cout << "What are your majors (ex. CSCI, ASIAN) ";
	getline(cin, majors);
	user = Student(name, yearS, yearE, majors);
}

void requestCourses() {
	string courses;
	cout << "What are some courses that you have taken? (ex. CSCI125, STAT 110)" << endl;
	getline(cin, courses);
	user.addCourses(courses);
}

int main(int argc, const char *argv[]) {
	loadCourses();
	
	// Method 1: Dynamic.
	// welcome();
	// requestCourses();

	// Method 2: Hard-coded file path.
	Student user("data/user.txt");
	
	// Method 3: File path as an argument.
	// Student user(argv[1]);

	user.display();

	cout << "Question: Has the user taken CSCI 251? ";
	cout << user.hasTakenCourse("CSCI251") << endl;

	return 0;
}

// TODO: Add concentrations to Student

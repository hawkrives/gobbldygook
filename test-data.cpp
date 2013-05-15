#include "general.hpp"
#include "course.hpp"
#include "student.hpp"
using namespace std;

map<ID, Course> mapped_courses;
Student user;

void loadCourses() {
	ifstream infile("data/2012-13-s2-csv.csv");
	string str; // read in the header line
	getline(infile, str);
	while (infile.peek() != -1){
		Course incourse(infile);
		mapped_courses.insert(pair<ID, Course>(incourse.getID(), incourse));
	}
	for (map<ID, Course>::iterator c = mapped_courses.begin(); c != mapped_courses.end(); ++c)
		if (c->second.getProfessor()[1] == ' ')
			if (c->second.getProfessor()[2] == '0' || c->second.getProfessor()[2] == '1')
				cout << c->second << endl;
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
	user = Student("data/user.txt");
	
	// Method 3: File path as an argument.
	// Student user(argv[1]);

	user.display();
	
	bool i = ID("CSCI251") == ID("CSCI 251");
	cout << i << endl;

	cout << "Question: Has the user taken CSCI 251? ";
	cout << user.hasTakenCourse("csci251") << endl;

	return 0;
}

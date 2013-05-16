#include "general.hpp"
#include "course.hpp"
#include "student.hpp"
using namespace std;

vector<Course> all_courses;
Student user;

void loadCourses(string filename) {
	ifstream infile(filename.c_str());
	string str; // read in the header line
	getline(infile, str);
	while (infile.peek() != -1){
		Course incourse(infile);
		all_courses.push_back(incourse);
		// cout << incourse << endl;
	}

	for (vector<Course>::iterator c = all_courses.begin(); c != all_courses.end(); ++c) {
		if (c->getProfessor()[1] == ' ')
			if (c->getProfessor()[2] == '0' || c->getProfessor()[2] == '1')
				cout << *c << endl;
		if (c->getDepartment(0) == NONE)
			cout << *c << endl;
	}
}

void readData() {
	loadCourses("data/2012-13-s2.csv");
	loadCourses("data/2012-13-interim.csv");
	loadCourses("data/2012-13-s1.csv");

	loadCourses("data/2011-12-s2.csv");
	loadCourses("data/2011-12-interim.csv");
	loadCourses("data/2011-12-s1.csv");

	loadCourses("data/2010-11-s2.csv");
	loadCourses("data/2010-11-interim.csv");
	loadCourses("data/2010-11-s1.csv");
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
	readData();
	
	// Method 1: Dynamic.
	// welcome();
	// requestCourses();

	// Method 2: Hard-coded file path.
	user = Student("data/example.txt");
	
	// Method 3: File path as an argument.
	// Student user(argv[1]);

	user.updateStanding();
	user.display();

	return 0;
}

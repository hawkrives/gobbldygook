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

vector<string> parseArguments(int argc, const char* argv[]) {
//	cout << argc << endl;
	vector<string> arguments;
	for (int i = 1; i < argc; i++) {
//		cout << argv[i] << endl;
		arguments.push_back(argv[i]);
	}
	return arguments;
}

int main(int argc, const char *argv[]) {
	vector<string> arguments = parseArguments(argc, argv);
	readData();
	
	if (arguments.size() > 0) {
		string arg0 = arguments.at(0);
		if (arg0 == "--find" || arg0 == "-f") {
			if (arguments.size() == 2) {
				Course c = Course(arguments.at(1));
				c.display();
			}
		}

		else if (arg0 == "--load" || arg0 == "-l") {
			if (arguments.size() == 2) {
				user = Student(arguments.at(1));
				user.display();
			}
		}

		else if (arg0 == "--demo") {
			user = Student("data/example.txt");
			user.display();
		}

		else if (arg0 == "--stress") {
			user = Student("data/stress.txt");
			user.display();
		}
		
		else if (arg0 == "--debug") {
			for (vector<Course>::iterator c = all_courses.begin(); c != all_courses.end(); ++c) {
				if (c->getProfessor()[1] == ' ')
					if (c->getProfessor()[2] == '0' || c->getProfessor()[2] == '1')
						cout << *c << endl;
				if (c->getDepartment(0) == NONE)
					cout << *c << endl;
			}
		}

		else if (arg0 == "--interactive" || arg0 == "-i") {
			string name, yearS = "", yearE = "", majors;
			cout << "Welcome!" << endl;
			cout << "What is your name? ";
			getline(cin, name);
			cout << "What year do you graduate? ";
			getline(cin, yearE);
			cout << "What are your majors (ex. CSCI, ASIAN) ";
			getline(cin, majors);
			user = Student(name, yearS, yearE, majors);
			
			string courses;
			cout << "What are some courses that you have taken? (ex. CSCI125, STAT 110)" << endl;
			getline(cin, courses);
			user.addCourses(courses);
			
			user.display();
		}
	}
	else {
		cout << "This program works best if you give it some data ;)" << endl;
		cout << "However, we have some example stuff to show you anyway." << endl;
		user = Student("users/example.txt");
		user.display();
	}

	return 0;
}

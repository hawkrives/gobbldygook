#include "data-general.hpp"
#include "data-course.hpp"
#include "data-major.hpp"
#include "data-student.hpp"
using namespace std;

vector<Course> all_courses;
Student user;

void loadCourses() {
	ifstream infile("data/2012-13-s2-csv.csv");
	string str; // read in the header line
	getline(infile, str);
	while (infile.peek() != -1){
		Course incourse(infile);
		all_courses.push_back(incourse);
		// cout << incourse << endl;
	}
}

void whatDidICallThisWith(int argc, const char *argv[]) {
	int count;

	printf ("This program was called with \"%s\".\n",argv[0]);

	if (argc > 1) {
		for (count = 1; count < argc; count++) {
			printf("argv[%d] = %s\n", count, argv[count]);
		}
	}
	else {
		printf("The command had no other arguments.\n");
	}
}

void welcome() {
	string name, yearS, yearE, majors;
	// cout << "Welcome!" << endl;
	// cout << "What is your name? ";
	// getline(cin, name);
	name = "Xandra Best";
	// cout << "What year do you graduate? ";
	// cin >> yearE;
	// cout << "What are your majors (ex. CSCI, ASIAN) ";
	// getline(cin, majors);
	majors = "CSCI, STAT, ASIAN";
	user = Student(name, "", "", majors);
}

void getCourses() {
	string courses;
	// cout << "What are some courses that you have taken? (ex. CSCI125, STAT 110)" << endl;
	// cout << "> ";
	// getline(cin, courses);
	courses = "CSCI 215, stat 110, THEAT398, writ211";
	user.addCourses(courses);
}

int main(int argc, const char *argv[]) {
	loadCourses();
	// Course c("BIO 126");
	// cout << c << endl;
	welcome();
	getCourses();
	cout << user << endl;
	// if (argc == 2)
	// 	Student person(argv[1]);
	// else
	// 	Student person("data/user.json");

	return 0;
}

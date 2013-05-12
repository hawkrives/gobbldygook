#include "data-general.hpp"
#include "data-course.hpp"
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
	// for (vector<Course>::iterator c = all_courses.begin(); c != all_courses.end(); ++c)
	// 	if (c->getProfessor()[1] == ' ')
	// 		if (c->getProfessor()[2] == '0' || c->getProfessor()[2] == '1')
	// 			c->displayMany();
}

void whatDidICallThisWith(int argc, const char *argv[]) {
	printf ("This program was called with \"%s\".\n",argv[0]);

	if (argc > 1)
		for (int count = 1; count < argc; count++)
			printf("argv[%d] = %s\n", count, argv[count]);
	else
		printf("The command had no other arguments.\n");
}

void welcome() {
	string name, yearS = "", yearE = "", majors;
	// cout << "Welcome!" << endl;
	// cout << "What is your name? ";
	// getline(cin, name);
	name = "Xandra Best";
	// cout << "What year do you graduate? ";
	// cin >> yearE;
	// cout << "What are your majors (ex. CSCI, ASIAN) ";
	// getline(cin, majors);
	majors = "CSCI, STAT, ASIAN";
	user = Student(name, yearS, yearE, majors);
}

void getCourses() {
	string courses;
	// cout << "What are some courses that you have taken? (ex. CSCI125, STAT 110)" << endl;
	// cout << "> ";
	// getline(cin, courses);
	courses = "PHIL 251A,PHIL 251B, REL 296A, REL 296B, STAT 110";
	// courses = "CSCI 251, stat 110, THEAT398, writ211";
	user.addCourses(courses);
}

int main(int argc, const char *argv[]) {
	loadCourses();
	// cout << getCourse("STAT 10") << endl;
	// Course c("BIO 126");
	// cout << c << endl;
	welcome();
	getCourses();
	user.display();

	return 0;
}

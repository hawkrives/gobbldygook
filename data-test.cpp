#include "data-general.hpp"
#include "data-course.hpp"
#include "data-major.hpp"
#include "data-student.hpp"
using namespace std;

vector<Course> courses;

void loadCourses() {
	ifstream infile("data/2012-13-s2-csv.csv");
	while (infile.peek() != -1){
		Course incourse(infile);
		courses.push_back(incourse);
		cout << incourse << endl;
		// incourse.showAll();
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

int main(int argc, const char *argv[]) {
	loadCourses();
	if (argc == 2)
		Student person(argv[1]);
	else
		Student person("data/user.json");

	return 0;
}
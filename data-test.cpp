#include "data-general.hpp"
#include "data-course.hpp"
#include "data-major.hpp"
#include "data-student.hpp"
using namespace std;

int main() {
	ifstream infile("data/2012-13-s2.csv");
	vector<Course> courses;

	string dummyLine;
	getline(infile, dummyLine);

	while (infile.peek() != -1){
		Course incourse(infile);
		courses.push_back(incourse);
		// cout << incourse << endl;
		incourse.showAll();
	}
}

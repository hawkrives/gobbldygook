#include "data-general.hpp"
#include "data-course.hpp"
#include "data-major.hpp"
#include "data-student.hpp"
using namespace std;

int main() {
	ifstream g("data/2012-13-s2.csv");
	vector<Course> courses;

	string dummyLine;
	getline(g, dummyLine);

	while (g.peek() != -1){
		Course incourse(g);
		courses.push_back(incourse);
		cout << incourse << endl;
	}
}

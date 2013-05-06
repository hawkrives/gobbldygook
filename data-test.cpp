#include "data-general.hpp"
#include "data-concentration.hpp"
#include "data-conversation.hpp"
#include "data-course.hpp"
#include "data-department.hpp"
#include "data-instructor.hpp"
#include "data-major.hpp"
#include "data-student.hpp"


int main() {
	ifstream g("data/2012-13-s2.csv");
	vector<Course> courses;

	string dummyLine;
	getline(g, dummyLine);

	//	while (g.peek() != -1){
	//		Course incourse(g);
	//		courses.push_back(incourse);
	//		cout << incourse << endl;
	//}

	cout << JsonBox::loadFromFile("data/user.json") << endl;
}

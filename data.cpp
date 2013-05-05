#include "data.hpp"

int main() {
	ifstream g("data/courses-s2-1213.csv");
	vector<Course> courses;

	int i = 0;
	string dummyLine;
	getline(g, dummyLine);

	while (!g.eof()) {
		Course incourse(g);
		courses.push_back(incourse);
		incourse.display();
		i++; cout << i << endl;
	}
	
	for_each(courses.begin(), courses.end(), spit);
}

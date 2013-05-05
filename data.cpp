#include "data.hpp"

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
	
	//for_each(courses.begin(), courses.end(), spit);
}

#ifndef __gobbldygook_Color__
#define __gobbldygook_Color__

#include <iostream>
using namespace std;

struct Color {
	int red, green, blue;
	Color();
	Color(int single);
	Color(int r, int g, int b);
	Color(const &Color c);
	void display();
};

ostream &operator<<(ostream &os, Color c);

#endif /* defined(__gobbldygook_Color__) */

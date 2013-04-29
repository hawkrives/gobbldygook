#ifndef __gobbldygook_Color__
#define __gobbldygook_Color__

#include <iostream>
using namespace std;

struct Color {
	double red, green, blue;
	Color();
	Color(double single);
	Color(double r, double g, double b);
	Color(const Color &c);
	void display();
	Color &operator= (const Color &c);
};

ostream &operator<<(ostream &os, Color c);

#endif /* defined(__gobbldygook_Color__) */

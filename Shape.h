#ifndef __lab8__Shape__
#define __lab8__Shape__

#include <iostream>
using namespace std;
#include "ColorPoint2.h"

class Shape {
protected:
	Color color;
	Point2 location;
public:
	Shape();
	Shape(Point2 p);
	Shape(istream &is);
	
	Color get_color();
	Point2 get_position();

	void set_color(Color c);
	void set_position(int x, int y);
	void set_location(Point2 p);
	
	virtual void display();
};

ostream &operator<<(ostream &os, Shape p);

#endif /* defined(__lab8__Shape__) */

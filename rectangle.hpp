#ifndef __Rectangle__
#define __Rectangle__

#include "opengl-include.hpp"
#include "color.hpp"

using namespace std;

class Rectangle {
public:
	double x1, y1, x2, y2;
	double width, height;
	Color color;

	void init(double x, double y, double w, double h, Color c);

	Rectangle();
	Rectangle(double x, double y, double w, double h);
	Rectangle(double x, double y, double w, double h, Color c);
	Rectangle(const Rectangle &c);
	Rectangle &operator= (const Rectangle &c);
	
	void setX(double x);
	void setY(double y);
	void setWidth(double w);
	void setHeight(double h);
	void setColor(Color c);

	double getX();
	double getY();
	double getWidth();
	double getHeight();
	
	bool hover(double x, double y);
	void draw();
};

#endif
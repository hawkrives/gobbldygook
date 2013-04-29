#include "Rectangle.h"

Rectangle::Rectangle() {}
Rectangle::Rectangle(double x, double y, double w, double h) {
	init(x, y, w, h, Color(0));
}
Rectangle::Rectangle(double x, double y, double w, double h, Color c) {
	init(x, y, w, h, c);
}
Rectangle::Rectangle(const Rectangle &c) {
	init(c.x1, c.x2, c.width, c.height, c.color);
}
void Rectangle::init(double x, double y, double w, double h, Color c) {
	cout << "+ Creating rectangle (";
	cout << "x:" << x << ", "; 
	cout << "y:" << y << ", ";
	cout << "w:" << w << ", ";
	cout << "h:" << h << ")" << endl;

	width = w; height = h;
	x1 = x; x2 = x1 + width;
	y1 = y; y2 = y1 + height;
	color = c;

	cout << "- Created rectangle (";
	cout << "x1:" << x1 << ", "; 
	cout << "y1:" << y1 << ", ";
	cout << "x2:" << x2 << ", "; 
	cout << "y2:" << y2 << ", ";
	cout << "w:" << width << ", ";
	cout << "h:" << height << ")" << endl;
}
Rectangle& Rectangle::operator= (const Rectangle &c) {
	if (this == &c) return *this;
	init(c.x1, c.x2, c.width, c.height, c.color);
    return *this;
}

void Rectangle::setX(double x) {
	x1 = x;
	x2 = x1 + width;
}
void Rectangle::setY(double y) {
	y1 = y; 
	y2 = y1 + height;
}
void Rectangle::setWidth(double w) {
	width = w;
	x2 = x1 + width;
}
void Rectangle::setHeight(double h) {
	height = h;
	y2 = y1 + height;
}
void Rectangle::setColor(Color c) {
	color = c;
}

double Rectangle::getX() { return x1; }
double Rectangle::getY() { return y1; }
double Rectangle::getWidth() { return width; }
double Rectangle::getHeight() { return height; }

bool Rectangle::hover(double x, double y) {
	return x >= x1 && y >= y1 &&
           x <= x1 + x2 &&
           y <= y1 + y2;
}

void Rectangle::draw() {
	glColor3f(color.red, color.green, color.blue);
	glBegin(GL_POLYGON);
		glVertex2f(x1, y1);  // upper left
		glVertex2f(x1, y2);  // lower left
		glVertex2f(x2, y2);  // lower right
		glVertex2f(x2, y1);  // upper right
	glEnd();
	cout << "* Drew rectangle (";
	cout << "x:" << x1 << ", "; 
	cout << "y:" << y1 << ", ";
	cout << "w:" << width << ", ";
	cout << "h:" << height << ", ";
	cout << "red: " << color.red << ", ";
	cout << "green: " << color.green << ", ";
	cout << "blue: " << color.blue << ")" << endl;
}

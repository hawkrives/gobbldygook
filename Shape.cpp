#include "Shape.h"
using namespace std;

Shape::Shape() : color(0), location(0, 0) {}
Shape::Shape(Point2 p) : color(0, 0, 0), location(p) {}

Shape::Shape(istream &is) {
	is >> color.red >> color.green >> color.blue;

	is >> location.x >> location.y;
}

Color Shape::get_color() {
	return color;
}
Point2 Shape::get_position() {
	return location;
}

void Shape::set_color(Color c) {
	color = c;
}
void Shape::set_position(int x, int y) {
	location(x, y);
}
void Shape::set_location(Point2 p) {
	location = p;
}

ostream &operator<<(ostream &os, Shape p) {
	os << "Shape: ";
	os << p.get_color();
	os << p.get_position();
	return os;
}
void Shape::display() {
	cout << *this << endl;
}

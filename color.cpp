#include "color.hpp"

Color::Color() {
	red = green = blue = 0;
}
Color::Color(double single) {
	red = green = blue = single;
}
Color::Color(double r, double g, double b) {
	red = r;
	green = g;
	blue = b;
}
Color::Color(const Color &c) {
	red = c.red;
	green = c.green;
	blue = c.blue;
}
Color& Color::operator=(const Color &c) {
	if (this == &c)
		return *this;
	red = c.red;
	green = c.green;
	blue = c.blue;

	return *this;
}
ostream &operator<<(ostream &os, Color c) {
	return os << c.red << " " << c.green << " " << c.blue << "  ";
}
void Color::display() {
	cout << *this << endl;
}

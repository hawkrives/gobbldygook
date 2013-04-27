#include "Color.h"

Color::Color() {
	red = green = blue = 0;
}
Color::Color(int single) {
	red = green = blue = single;
}
Color::Color(int r, int g, int b) {
	red = r;
	green = g;
	blue = b;
}
ostream &operator<<(ostream &os, Color c) {
	return os << c.red << " " << c.green << " " << c.blue << "  ";
}
void Color::display() {
	cout << *this << endl;
}

#include "ui-elements.h"

// Button::Button() {
// 	cout << "Inside Button()" << endl;
// 	UIRect::init(5, 5, 50, 20, "");
// 	setBorderWidth(5);
// }

Button::Button(double x, double y, double w, double h, string text) : UIRect(x, y, w, h, text) {
	cout << "Was inside Button(" << x << ", " << y << ", " << w << ", " << h << ")" << endl;
}
Button::Button(const Button &c) : UIRect(c) {
	cout << "Was inside Button(c)" << endl;
}

Button& Button::operator=(const Button &c) {
	cout << "Inside Button operator=()" << endl;
	if (this == &c)
		return *this;

	UIRect::copy(c);

	return *this;
}

// bool Button::hover(int x, int y) {
// 	return UIRect::hover(x, y);
// }

void Button::draw() {
	UIRect::draw();
}

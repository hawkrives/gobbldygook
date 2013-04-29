#include "ui-elements.h"

// TextBox::TextBox() {
// 	cout << "Inside TextBox()" << endl;
// 	UIRect::init(5, 5, 50, 20, "");
// 	setBorderWidth(2);
// }

TextBox::TextBox(double x, double y, double w, double h, string text) : UIRect(x, y, w, h, text) {
	cout << "Inside TextBox(x,y,w,h)" << endl;
}

TextBox::TextBox(const TextBox &c) : UIRect(c) {
	cout << "Inside TextBox(const &c)" << endl;
}

TextBox& TextBox::operator=(const TextBox &c) {
	if (this == &c)
		return *this;

	UIRect::copy(c);

	return *this;
}

// bool Button::hover(int x, int y) {
// 	return UIRect::hover(x, y);
// }

void TextBox::draw() {
	UIRect::draw();
}

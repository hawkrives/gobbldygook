#include "ui-textboxes.h"

TextBox::TextBox(double x, double y, double w, double h, string text) : UIRect(x, y, w, h, text) {}
TextBox::TextBox(const TextBox &c) : UIRect(c) {}

TextBox& TextBox::operator=(const TextBox &c) {
	if (this == &c) return *this;
	UIRect::copy(c);
	return *this;
}

void TextBox::draw() {
	UIRect::draw();
}

#include "ui-textboxes.hpp"

/*
 * TextBox
 *
 */

TextBox::TextBox(double x, double y, double w, double h, string text) : UIRect(x, y, w, h, text) {}
TextBox::TextBox(const TextBox &c) : UIRect(c) {}

TextBox& TextBox::operator=(const TextBox &c) {
	if (this == &c) return *this;
	UIRect::copy(c);
	return *this;
}

/*
 * FilterBox
 *
 */

FilterBox::FilterBox(double x, double y, double w, double h, string text) : TextBox(x, y, w, h, text) {}
FilterBox::FilterBox(const FilterBox &c) : TextBox(c) {}

FilterBox& FilterBox::operator=(const FilterBox &c) {
	if (this == &c) return *this;
	TextBox::copy(c);
	return *this;
}

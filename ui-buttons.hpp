#ifndef __Button__
#define __Button__

#include "ui-rect.hpp"
using namespace std;

class Button : public UIRect {
public:
	Button();
	Button(double x, double y, double w, double h, string text);
	Button(const Button &c);

	Button& operator= (const Button &c);
};
#endif
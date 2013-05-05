#ifndef __UIRect__
#define __UIRect__

#include "ui.hpp"
#include "rectangle.hpp"
#include "ui-label.hpp"

using namespace std;

class UIRect {
private:
	void createBorder(double size, Color color);
protected:
	double x1, y1, x2, y2;
	double width, height;
	double borderThickness;

	int labelAlignment;
	Color backgroundColor, borderColor;
	Rectangle background, border;
public:
	UIRect();
	UIRect(double x, double y, double w, double h, string text);
	UIRect(const UIRect &c);
	UIRect& operator = (const UIRect &c);

	virtual ~UIRect();

	Label label;
	bool over;
	bool active;

	void init(double x, double y, double w, double h, string text);
	void copy(const UIRect &c);

	string getLabel();
	void setLabel(string text);

	void setX1(double x);
	void setX2(double x);
	void setY1(double y);
	void setY2(double y);

	void setWidth(double w);
	void setHeight(double h);
	void setBorderWidth(double w);

	void setBorderColor(Color c);
	void setBorderColor(double c);
	void setBorderColor(double r, double g, double b);

	void setBackgroundColor(Color c);
	void setBackgroundColor(double c);
	void setBackgroundColor(double r, double g, double b);

	void setAlignment(int place);

	bool hover(int x, int y);
	virtual void draw();
};

#endif

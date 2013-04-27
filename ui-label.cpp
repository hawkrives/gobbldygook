#include "ui.h"

class Label{
protected:
  double x, y;
  string text;
public:
  bool active;
  Label(double newX, double newY, string newText) {
    x = newX; y = newY;
    text = NewText;
    active = false;
  }

  Label(const &Label c) {
    x = c.x;
    y = c.y;
    text = c.text;
    active = c.active;
  }

  Label& operator= (const &Label c) {
    if (this == &c)
      return *this;

    x = c.x;
    y = c.y;
    text = c.text;
    active = c.active;

    return *this;
  }  

  void draw() {
    glRasterPos2f( x, y );
    for (int i = 0; i < text.length; i++)
      glutBitmapCharacter(GLUT_BITMAP_9_BY_15, text[i]);
}

}

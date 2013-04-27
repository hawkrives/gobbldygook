#include <iostream>
#include <sstream>
#include <fstream>
using namespace std;
#ifdef MACOSX
#include <GLUT/glut.h>
#else
#include <GL/glut.h>
#endif
#include <string.h>
#include <math.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>
#include "network.h"

int WIDTH = 240;  // width of the user window
int HEIGHT = 200;  // height of the user window
char programName[] = "proto-multiplayer";
double defaultSize = 10;

// store position and process-id for incoming communications
double position_x[1000], position_y[1000];
int myPID, pid[1000];

// the following function draws a rectangle, given
//   the upper left vertex and the width and height
void drawBox(double x, double y, double width=defaultSize, double height=defaultSize) {
	glBegin(GL_POLYGON);
		glVertex2f(x, y);  // upper left
		glVertex2f(x, y + height);  // lower left
		glVertex2f(x + width, y + height);  // lower right
		glVertex2f(x + width, y);  // upper right
	glEnd();
}

// the following function chooses a (quasi-random) color, starting from an int
void chooseColor(int n) {
	float col[3];
	int val[] = { 34972, 43982, 69202, 498056, 349082, 43958 };
	for ( int i=0; i<3; ++i ) {
		col[i] = ((val[i]*n + val[i+3])%256)/256.;  //  as if random 
		if ( col[i] < .5 ) col[i] += .5;  // use just brighter colors
	}
	glColor3f(col[0], col[1], col[2]);  // dark gray
}

void drawWindow() {
	// clear the buffer
	glClear(GL_COLOR_BUFFER_BIT);

	// draw a box with "my" color at the top
	chooseColor(myPID);
	drawBox( 0, 0, WIDTH, 5 );

	// draw all the currently existing players
	for ( int i=0; i<1000; ++i ) {
		if ( -1 != pid[i] ) {
			chooseColor(pid[i]);
			drawBox( position_x[i], position_y[i] );
		}
	}

	// tell the graphics card that we're done-- go ahead and draw!
	//   (technically, we are switching between two color buffers...)
	glutSwapBuffers();
}

// close the window and finish the program
void exitAll() {
	int win = glutGetWindow();
	glutDestroyWindow(win);
	exit(0);
}

// process keyboard events
void keyboard (unsigned char c, int x, int y) {
	switch(c) {
		case 'q':
		case 'Q':
		case 27:
			exitAll();
			break;
		default:
			break;
	}
}

// process "special" keyboard events (those having to do with arrow keys)
void specialKeyboard (int key,int x, int y) {
	// update my current position
	static int shape_position_x = WIDTH/2, move_x = defaultSize;
	static int shape_position_y = HEIGHT/2, move_y = defaultSize;
	switch (key) {
		case GLUT_KEY_LEFT:
			shape_position_x -= move_x;
			break;
		case GLUT_KEY_RIGHT:
			shape_position_x += move_x;
			break;
		case GLUT_KEY_UP:
			shape_position_y -= move_y;
			break;
		case GLUT_KEY_DOWN:
			shape_position_y += move_y;
			break;
	}

	// send my position off to whoever is listening on the network
	ostringstream toSend;
	toSend << myPID << ' ' << shape_position_x << ' ' << shape_position_y;
	toSend.flush();
	// cout << "toSend has " << toSend.str() << endl;
	multicast(toSend.str().c_str());
}

// process multicast events
void receiveMulticast (const char *msg) {
	istringstream ss(msg);
	int id, x, y;
	ss >> id >> x >> y;
	// cout << "got multicast " << id << ' ' << x << ' ' << y << endl;

	// store this info in our global arrays
	pid[ id%1000 ] = id;
	position_x[ id%1000 ] = x;
	position_y[ id%1000 ] = y;

	glutPostRedisplay();
}

// the atTime function is called approximately every 60th of a second.
//   In this case, it is critical to have an atTime function, since
//   we want something to happen even when the user does nothing
void atTime(int tmp) {
	const int bufMaxLen = 1000;  // choose a max size for messages
	char buffer[bufMaxLen];
	listen(buffer, bufMaxLen);
	glutTimerFunc(1000/60., atTime, 0);  // make it happen again!
}

// the reshape function handles the case where the user changes the size
//   of the window.  We need to fix the coordinate
//   system, so that the drawing area is still the unit square.
void reshape(int w, int h) {
	 glViewport(0, 0, (GLsizei) w, (GLsizei) h);
	 WIDTH = w;  HEIGHT = h;
	 glMatrixMode(GL_PROJECTION);
	 glLoadIdentity();
	 glOrtho(0., WIDTH-1, HEIGHT-1, 0., -1.0, 1.0);
}

// the init function sets up the graphics card to draw properly
void init(void) {
	// clear the window to black
	glClearColor(0.0, 0.0, 0.0, 1.0);
	glClear(GL_COLOR_BUFFER_BIT);

	// set up the coordinate system:  number of pixels along x and y
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho(0., WIDTH-1, HEIGHT-1, 0., -1.0, 1.0);

	// welcome message
	cout << "Welcome to " << programName << ". Try running several of these, and use the arrow keys." << endl;
}


// initGLWindow is the function that starts the ball rolling, in
//  terms of getting everything set up and passing control over to the
//  glut library for event handling.  It needs to tell the glut library
//  about all the essential functions:  what function to call if the
//  window changes shape, what to do to redraw, handle the keyboard,
//  etc.
void initGLWindow() {
	char *argv[] = { programName };
	int argc = sizeof(argv) / sizeof(argv[0]);
	glutInit(&argc, argv);
	glutInitDisplayMode( GLUT_RGBA | GLUT_DOUBLE );
	glutInitWindowSize(WIDTH,HEIGHT);
	glutInitWindowPosition(100,100);
	glutCreateWindow(programName);
	init();

	glutDisplayFunc(drawWindow);
	glutReshapeFunc(reshape);
	glutKeyboardFunc(keyboard);
	glutSpecialFunc(specialKeyboard);
	glutTimerFunc(1000/60., atTime, 0);
	glutMainLoop();
}

int main() {
	initNetwork(25100);
	myPID = getpid();
	for ( int i=0; i<1000; ++i ) pid[i] = -1;  // initialize as unused
	specialKeyboard(-1, 0, 0);                // initialize movement
	initGLWindow();
}

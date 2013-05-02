CC   = g++
OPTS = -Wall -g
LIBS = -lGL -lglut -lm
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
 CC = clang
 MACOSX_DEFINE = -DMACOSX -I/sw/include
 LIBS = -I/usr/common/include -I/usr/include/GL -L/System/Library/Frameworks/OpenGL.framework/Libraries -framework GLUT -framework OpenGL -lGL -lm -lobjc -lstdc++

endif

schedule: ui
	g++ $(OPTS) -o schedule schedule.o $(LIBS)


ui: schedule.cpp elements
	g++ $(OPTS) $(MACOSX_DEFINE) -c schedule.cpp

# data: data.cpp data.h
	# g++ $(OPTS) $(MACOSX_DEFINE) -c data.cpp


elements: ui-rect buttons label textboxes

buttons: ui-buttons.cpp ui-buttons.h ui-rect
	g++ $(OPTS) $(MACOSX_DEFINE) -c ui-buttons.cpp

textboxes: ui-textboxes.cpp ui-textboxes.h ui-rect
	g++ $(OPTS) $(MACOSX_DEFINE) -c ui-textboxes.cpp

ui-rect: ui-rect.cpp ui-rect.h ui.h label rectangle
	g++ $(OPTS) $(MACOSX_DEFINE) -c ui-rect.cpp

label: ui-label.cpp ui-label.h ui.h
	g++ $(OPTS) $(MACOSX_DEFINE) -c ui-label.cpp


rectangle: Rectangle.cpp Rectangle.h color
	g++ $(OPTS) $(MACOSX_DEFINE) -c Rectangle.cpp

color: Color.cpp Color.h
	g++ $(OPTS) $(MACOSX_DEFINE) -c Color.cpp

clean:
	rm -f *.o schedule

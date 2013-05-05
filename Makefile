SHELL= /bin/sh
CC   = g++
OPTS = -Wall -g
LIBS = -lGL -lglut -lm
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
CC = clang++
#CC = ~/Projects/emscripten/emcc
MACOSX_DEFINE = -DMACOSX -I/sw/include
INCLUDES = -I/usr/common/include -I/usr/include/GL
LIBS = $(INCLUDES) \
	-L/System/Library/Frameworks/OpenGL.framework/Libraries \
	-framework GLUT -framework OpenGL -lGL -lm -lobjc -lstdc++
endif

UI_OBJ = ui-rect.o ui-toggle.o ui-buttons.o ui-textboxes.o ui-label.o rectangle.o color.o
DATA_OBJ = data.o
OBJECTS = $(UI_OBJ) $(DATA_OBJ)

all: schedule.cpp $(OBJECTS)
	$(CC) $(OPTS) -o schedule schedule.cpp $(OBJECTS) $(INCLUDES)

data-test: $(DATA_OBJ)
	$(CC) $(OPTS) -o data-test data.cpp $(INCLUDES)

ui-test: $(UI_OBJ)
	$(CC) $(OPTS) -o ui-test ui-test.cpp $(INCLUDES)


data.o: data.cpp data.hpp
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c data.cpp


ui-toggle.o: ui-toggle.cpp ui-toggle.hpp ui-rect.o
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-toggle.cpp

ui-buttons.o: ui-buttons.cpp ui-buttons.hpp ui-rect.o
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-buttons.cpp

ui-textboxes.o: ui-textboxes.cpp ui-textboxes.hpp ui-rect.o
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-textboxes.cpp

ui-rect.o: ui-rect.cpp ui-rect.hpp ui.hpp ui-label.o rectangle.o
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-rect.cpp

ui-label.o: ui-label.cpp ui-label.hpp ui.hpp
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-label.cpp


rectangle.o: rectangle.cpp rectangle.hpp color.o
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(LIBS) -c rectangle.cpp

color.o: color.cpp color.hpp
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(LIBS) -c color.cpp

clean:
	rm -f *.o schedule

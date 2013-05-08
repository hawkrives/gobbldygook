SHELL= /bin/sh
CC   = g++
OPTS = -Wall -g
LIBS = -lGL -lglut -lm
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
CC = clang++
MACOSX_DEFINE = -DMACOSX -I/sw/include
INCLUDES = -I/usr/common/include
LIBS = $(INCLUDES) \
	-lm -lobjc -lstdc++
endif

DATA_OBJ = data-course.o data-general.o data-major.o data-student.o
OBJECTS = $(DATA_OBJ)

all: data-test

data-test: data-test.o
	$(CC) $(OPTS) -o data-test data-test.o $(LIBS)


data-test.o: $(DATA_OBJ)
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c data-test.cpp

data-course.o: data-course.hpp data-major.o data-general.o
data-major.o: data-major.hpp data-general.o
data-student.o: data-student.hpp data-course.o data-major.o data-general.o

data-general.o: data-general.hpp

clean:
	rm -f *.o schedule

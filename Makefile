SHELL= /bin/sh
CC   = g++
OPTS = -Wall -g
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
CC = clang++
MACOSX_DEFINE = -DMACOSX -I/sw/include
LIBS = -I/usr/common/include
endif

DATA_OBJ = data-course.o data-general.o data-major.o data-student.o
OBJECTS = $(DATA_OBJ)

all: data-test

data-test: data-test.o
	$(CC) $(OPTS) -o data-test data-test.o $(LIBS)


data-test.o: $(DATA_OBJ)
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(LIBS) -c data-test.cpp

data-major.o: data-major.hpp data-general.o
data-course.o: data-course.hpp data-major.o data-general.o
data-student.o: data-student.hpp data-course.o data-major.o data-general.o

data-general.o: data-general.hpp

clean:
	rm -f *.o schedule

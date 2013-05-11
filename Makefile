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

DATA_OBJ = data-course.o data-general.o data-major.o data-student.o data-department.o
OBJECTS = $(DATA_OBJ) jsmn.o

all: data-test

# test-dataEntry: test-dataEntry.o
# 	$(CC) $(OPTS) -o data-test data-test.o $(LIBS)

data-test: data-test.o
	$(CC) $(OPTS) -o data-test data-test.o $(LIBS)

data-test.o: $(OBJECTS)
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(LIBS) -c data-test.cpp

data-major.o: data-major.hpp data-general.o
data-department.o: data-department.hpp data-general.o
data-course.o: data-course.hpp data-major.o data-general.o
data-student.o: data-student.hpp data-course.o data-major.o data-general.o jsmn.o
data-requirement.o: data-requirement.hpp data-course.hpp data-general.o

jsmn.o: jsmn/jsmn.cpp jsmn/jsmn.h
	$(CC) -c jsmn/jsmn.cpp

data-general.o: data-general.hpp

clean:
	rm -f *.o schedule

class Department {
protected:
  string name;
  Course** courses;
  Instructors** professors;
}

class Major {
protected:
  string name;
  Course** courses;
  int difficulty;
}

class Conc {
protected:
  string name;
  Course** courses;
  int difficulty;
}

class Conv {
protected:
  string name;
  Course** courses;
  int difficulty;
}

class Instructor {
protected:
  string name;
  Department department;
  string specialty;
}

class Course {
protected:
  int number;
  Department department;
  Major** majors;
  Conc** concs;
  string title;
  Instructor* professor;
  string description;
  float credits;
  string location;
  bool lab;
  gened geneds[];
  bool days[];
  float time[];
}

class Student {
protected:
  string name;
  Course** takenCourses;
  Major** majors;
  Conc** concs;
  Conv** convs;
  Instructor** favInstructors;
  string interests[];
  double gradYear;
}

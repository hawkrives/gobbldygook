#include <iostream>     // std::cout
#include <algorithm>    // std::for_each
#include <vector>       // std::vector

template<typename Target, typename Source>
Target lexical_cast(Source arg) {
	std::stringstream interpreter;
	Target result;
	if(!(interpreter << arg) ||
	   !(interpreter >> result) ||
	   !(interpreter >> std::ws).eof())
		throw bad_lexical_cast();
	return result;
}
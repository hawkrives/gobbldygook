template<class InputIterator, class Function>
Function for_each(InputIterator first, InputIterator last, Function fn) {
	while (first!=last) {
		fn (*first);
		++first;
	}
	return fn;      // or, since C++11: return move(fn);
}
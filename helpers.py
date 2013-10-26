def get_readable_list(passed_list, sep=', ', end=''):
	output = ""
	if isinstance(passed_list, list) or isinstance(passed_list, tuple):
		for i, item in enumerate(passed_list):
			if len(passed_list) is 1:
				output += str(item)

			else:
				if i is not (len(passed_list) - 1):
					output += str(item) + sep
				else:
					output += str(item)


	elif isinstance(passed_list, dict):
		for i, item in enumerate(sorted(passed_list.values())):
			if len(passed_list) is 1:
				output += str(item)

			else:
				if i is not (len(passed_list) - 1):
					output += str(item) + sep
				else:
					output += str(item)

	return output + end


def get_list_as_english(passed_list):
	output = ""
	for i, item in enumerate(passed_list):
		if len(passed_list) is 1:
			output += str(item) + ' '

		elif len(passed_list) is 2:
			output += str(item)
			if i is not (len(passed_list) - 1):
				output += " and "
			else:
				output += ""

		else:
			if i is not (len(passed_list) - 1):
				output += str(item) + ", "
			else:
				output += "and " + str(item) + ", "
	return output

def tidy_float(s):
	# taken from http://stackoverflow.com/questions/5807952/removing-trailing-zeros-in-python
	"""Return tidied float representation.
	Remove superflous leading/trailing zero digits.
	Remove '.' if value is an integer.
	Return '****' if float(s) fails.
	"""
	# float?
	try:
		f = float(s)
	except ValueError:
		return '****'
	# int?
	try:
		i = int(s)
		return str(i)
	except ValueError:
		pass
	# scientific notation?
	if 'e' in s or 'E' in s:
		t = s.lstrip('0')
		if t.startswith('.'): t = '0' + t
		return t
	# float with integral value (includes zero)?
	i = int(f)
	if i == f:
		return str(i)
	assert '.' in s
	t = s.strip('0')
	if t.startswith('.'): t = '0' + t
	if t.endswith('.'): t += '0'
	return t

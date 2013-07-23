def get_readable_list(passed_list, sep=', '):
	output = ""
	for i, item in enumerate(passed_list):
		if len(passed_list) is 1:
			output += str(item)

		else:
			if i is not (len(passed_list) - 1):
				output += str(item) + sep
			else:
				output += str(item)

	return output


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
				output += " "

		else:
			if i is not (len(passed_list) - 1):
				output += str(item) + ", "
			else:
				output += "and " + str(item) + ", "
	return output

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


import math
from helpers import get_readable_list

def split_names_from_string(s):
	s = s.split(',')
	s = "".join(s)
	s = s.split(' ')
	return s

def seperate_profs(p):
	p1 = p[:math.ceil(len(p)/2)]
	p2 = p[math.ceil(len(p)/2):]
	return p1, p2

def rearrange(names):
	if len(names)%2 is 0:
		last = names[0:math.ceil(len(names)/2)]
		first = names[math.ceil(len(names)/2):]
	else:
		last = names[0:math.ceil(len(names)/2)-1]
		first = names[math.ceil(len(names)/2)-1:]
	return first + last

def process_professor(prof_name):
	output = ""
	output += prof_name + '\n'
	seperated = split_names_from_string(prof_name)

	if p.count(',') is 2:
		strained = seperate_profs(seperated)

		name_list = []
		for name in strained:
			name_list.append(get_readable_list(rearrange(name), sep=' ', end=''))

		output += get_readable_list(name_list, sep=' and ', end='')

	else:
		name_list = rearrange(seperated)
		output += get_readable_list(name_list, sep=' ')

	return output

if __name__ == '__main__':
	profs = [
		'Tegtmeyer Pak, Katherine S. Wan, Pin Pin',
		'Thompson, Nancy M. Tradowsky, Christopher',
		'Bridges IV, William H.',
		'Klopchin, Heather J.',
		'Hall-Holt, Olaf A.',
		'Zayas, Roberto Lenertz, Lisa Y.',
		'Tegtmeyer Pak, Katherine S. Entenmann, Robert'
	]

	# print(get_readable_list(profs, sep='\n\n', end=''))
	for p in profs:
		print(process_professor(p), '\n')

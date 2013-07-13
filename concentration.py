from major import Major

class Concentration(Major):
	def __init__(self, dept="NONE"):
		super().__init__(dept, "concentrations/")

if __name__ == '__main__':
	tmp = [
		Major(dept="Asian")
	]
	for i in tmp:
		print(i)

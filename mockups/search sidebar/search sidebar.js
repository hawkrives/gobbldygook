var searchbox = document.querySelector('.js-searchbox')
var output = document.querySelector('.js-search-computation')
var results = document.querySelector('.js-search-results')

function computeQuery(e) {
	// (dept: ASIAN OR dept: Computer Science) AND prof: Ka Wong
	var string = e.target.value

	var tokenGroupsRegex = /\(.*\)/;
	var tokenGroups = tokenGroupsRegex.exec(string);

	// console.log(string.split(':'))
	console.log(tokenGroups)

	output.innerHTML = e.target.value
}

searchbox.oninput = computeQuery

module.exports = function randomChar() {
	return Math.random().toString(36).slice(2, 3)
}

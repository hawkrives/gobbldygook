// modified from http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
export default () => Math.random().toString(36).slice(2, 3)

# Contributing

We're using [conventional-changelog](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md) to automatically generate the changelogs. What that means is that there's a specified format for a commit:

	fix: stop graphite breaking when width < 0.1

	Closes #28

In short,

	<type>(<scope>): <subject>
	<BLANK LINE>
	<body>
	<BLANK LINE>
	<footer>

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

The body should use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit `Closes`. Breaking Changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

Here are our types:

- `feat`, `fix` or `perf`: will appear in the changelog.
- Any `BREAKING CHANGE` will always appear in the changelog.
- `docs`, `chore`, `style`, `refactor`, and `test`: non-changelog related tasks.

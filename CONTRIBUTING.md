# Contributing

# Questions/Issues

If you have a new feature you'd like to propose, a bug you found, or just an
overall discusssion you would like to start, please file an issue with the
appropriate label.

# Reporting a bug

1. Update to the latest stable release. (the issue may have already been
fixed)
2. Do your best to search for similar issues.
3. Provide a descriptive title, steps to reproduce, expected results and actual
results. (brownie points for screenshots and/or error stack traces)
4. Your issue will be verified and labeled.
5. Keep up to date with the status of your issue. If your issue becomes stale,
it may be closed.
6. If you're adventurous enough, submit a pull request with the fix
(see [Pull Requests](#pull-requests))

# Submitting a feature request

1. Search for similar feature requests. There's no sense in duplicate effort.
2. Provide a descriptive expalantion of the feature you are requesting and
examples of why the feature is needed.
3. If the feature seems complex, consider writing some documentation or an
example api to implement the feature.
4. If you're adventurous enough, submit a pull request with feature yourself.
(see [Pull Requests](#pull-requests))

# Pull Requests

Here's a quick guide to submitting pull requests for QA Tools

1. Fork the repo.
2. Ensure you have all development requirements. If you're unsure of the
requirements, read through that project's documentation. A good start is Node.js (0.12.x recommended).
3. Write a test(s) for your change. Only pull requests with
passing tests will be accepted.
4. Commit your change. If you're fixing a bug, note that isssue in your commit
message. (see [commit messages](#commit-messages)
5. Push to your fork and submit a pull request. In the pull request title,
please use one of the following tags: BUGFIX, DOCUMENTATION, ENHANCEMENT, FEATURE, REFACTOR.
 * FEATURE and ENHANCEMENT tags are for things users might be interested in.
    - FEATURE tag is a standalone, new addition. e.g. a new command
    - ENHANCEMENT tag is an improvement on an existing feature.

 In the description please provide an explanation as to why the change is being
 introduced, as well as a brief usage example.

 If the change requires configuartion changes or internal usage changes, please
 add a BREAKING tag. e.g. [BREAKING BUGFIX].

# Commit Messages

This project uses the [conventional-changelog](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit) convention. Commit messages should be formatted as follows:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type

 - **feat** (new feature or enhancement)
 - **fix** (a bug fix)
 - **docs** (documentation *inline or otherwise*)
 - **style** (indentation, whitespace, missing semicolon)
 - **refactor** (change(s) to code base that does not affect external behavior)
 - **test** (adding missing test)
 - **chore** (changes to build process, dependencies or other tooling)

### Scope

The scope could be anything specifying place of the commit change. For example
`router`, `stack`, `loggers`

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes"
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

Example:

```shell
feat(router): add logging options

 - Add bunyan logger support

Breaks default logger, logger must be specified
Issue #23
```

# Syntax

 - Two spaces, no tabs.
 - No trailing whitespace.
 - Final newline at the end of the file.
 - Follow all conventions already in place.

# Inline documenation

All inline documenation is written using [esdoc](https://esdoc.org/)

1. All code blocks must be fenced.
2. All code blocks must have a language declared.
3. All code blocks must be valid code for syntax highlighting.
4. All examples in code blocks must be aligned.
5. All references to code words must be enclosed in backticks.
6. Prefer a single space between sentences.
7. Wrap long markdown blocks > 80 characters.
8. Don't include blank lines after `@param` definitions.

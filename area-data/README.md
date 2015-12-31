## Details of the Hanson format

What we call the "Hanson format" is named after Professor Bob Hanson, who provided the original inspiration for this style of declarative area-of-study specification.

An *area of study* is a degree, major, concentration, or area of emphasis. In this document, unless otherwise specified, the phrases "major" and "area of study" are synonymous.


### Basics

Each major file must be a valid [YAML][yaml] file. That is, it will be a set of nested `key: value` pairs, where the end of the key is signified by a colon. YAML files **must** be intended with spaces, not tab characters.

[yaml]: http://yaml.org

The top level of a major file looks something like this:

```yaml
name: Major Name
type: major
revision: 2015-16
result: Requirement A & Requirement B

Requirement A: ART 102 & 103

Requirement B:
    result: CSCI 121 | 125 | 320
```

In the most basic sense, an area of study file is a list of requirements, where each requirement is composed of the courses that you must take to complete the requirement.

Each requirement must include either a `result` key, or a `message` key. (These key names are case-sensitive.) If no keys exist under a requirement, the value is parsed as a course expression, and implicitly assigned to `result`.

If a `message` key is provided, the message is rendered with markdown and displayed before the result. If only a message key is provided. It is rendered and shown with a button for easy acquiescence (to the demands of the message.)

The values of the `result` and `message` keys are interpreted as strings. In order to remain readable, we recommend splitting the contents of the string over multiple lines once it gets long. The string may be split by any number of line breaks, as long as the first non-whitespace character on the line is indented past the first character of the key.

```yaml
Requirement:
    message:
        You may include messages here.
        They can be broken
        across multiple lines.
```

`result` values are comprised of a mixture of course expressions and requirement references.

**Tip:** The system tracks which courses have been taken at the least specific level possible: department + number. The same course will not count for more than one requirement. (Section, year, semester, lab, and international qualifiers are stripped off for this comparison.)


## Defining an Area of Study

Before we dig in to what a result value is, let's think about the top level of the major file.

The top level must have at least four keys: `name`, `type`, `revision`, and `result`.

`name` is the name of the area of study.

`type` must be one of "degree," "major," "concentration," or "emphasis." These values are not case-sensitive.

`revision` is the school year during which the area was last modified; "2012-13" or "2015-16". It must include the year of the fall semester and the year of the spring semester, separated by a hyphen.

`result` is just like any other result key: a combination of requirement references and course expressions. It is unique, though, in that it will likely not include any course expressions itself, instead only referencing child requirements.


## What makes a `result`?

### Course Expressions

A course expression is a powerful construct. It can be as simple as "the user must have taken Computer Science 111," or as complex as "one course with both the EIN general education requirement *and* taken in a year before (or in the same year as) the highest year from courses with the BTS-T general education requirement," or really anything in-between.

The most basic course expression is a single course. A single course is specified, at the simplest level, by the department abbreviation, a space, then the course number, like `CSCI 115` or `AS/RE 150`. If you use a dual-department course, it must use the short abbreviations of the departments—AS instead of ASIAN, AR instead of ART—separated by a forward-slash (the `/` character.)

**Tip:** When you have several course expressions in a row that share the same department, you can leave off subsequent department declarations; each course between two department declarations will be assigned the last seen department from that result key.


### Boolean Expressions

These course expressions may be joined into a Boolean expression by way of an "and" operator (`&`, the ampersand) and/or an "or" operator (`|`, the pipe character).

The sections of a Boolean expression are evaluated as arguments to the operators. `A | B` returns true if either `A` or `B` is true, while `A & B` requires both to be true. Additionally, you can override the normal order of operations by way of parentheses.

Each individual course expression is evaluated to *either* `true` or `false`. This means that a Boolean expression such as `(CSCI 125 | 121) & 251 & 252` will be fulfilled if the student has taken:

- either of CS 125 or 121
- and CS 251
- and CS 252

When computing a boolean expression, parentheses take precedence, followed by `&`, and finally `|`.


### `of`-expressions

If you have a bunch of courses that students can take, it would be much too hard to write out all possible combinations of the courses. Imagine that you have three courses—`A`, `B`, and `C`—and the student may take any two of them. A boolean expression could be `(A & B) | (B & C) | (A & C)`—that's already pretty long; imagine how long it would get with, say, a choice of 3 courses from among 10 options.

That's why we support "of-expressions."

`two of ( CSCI 121, 125, ART 102, 103, 104 )`—the student must take two of the courses listed in the parentheses.

of-expressions may contain any of the expressions detailed in this document. `three of (CSCI 121 & 125, 241, 251 & 252)` is valid.

The number at the beginning of the of-expression may be any number between `zero` and `twenty`, or one of the words `all`, `any`, or `none`.

`none` equates to `zero`—that is, the student must have taken zero of the courses listed to pass the expression. `any` equates to `one`, and `all` is evaluated to be the number of items within the of-expression.

If you require the student to take more items that you list—say, `three of (CSCI 121, 251)`—Gobbldygook will warn you that the requirement can never be completed.


## Child Requirements

Those three types of expressions cover *most* of the needs of expressing major requirements. However, most majors will be easier to understand and specify if they are broken up into smaller chunks.

We call these smaller chunks "requirements." Each requirement may include any number of child requirements. Please make liberal use of child requirements when specifying majors.

Each requirement may be as simple as a `result` string. However, it may also be composed from the results of one or more child requirements.

Requirement names **must** begin with either a capital letter or a number, which may be followed by any number of additional letters, numbers, underscores, and hyphens.

The name of a requirement can be used as a reference to the result of that requirement.

```yaml
Requirement:
    result: Child Requirement 1 | Child Requirement 2 | Mathematics

    Child Requirement 1: CSCI 121
    Child Requirement 2: CSCI 251

    Mathematics:
        result: one of (A, B, C)
        A: MATH 111
        B: MATH 112
        C: MATH 113
```

If you include any child requirements, you must explicitly specify a `result` key in the host requirement. If you do not, the child requirements will never be taken into account.

**Tip:** Both boolean expressions and of-expressions support requirement references anywhere they support course expressions.

You can only reference an immediate child requirement.

This will not work:

```yaml
Parent:
    result: Grandchild
    Child:
        Grandchild: CSCI 121
```

`Parent` cannot see the children of `Child`. Instead, give `Child` a `result` of "Grandchild," and `Parent` a `result` of "Child".

```yaml
Parent:
    result: Child
    Child:
        result: Grandchild
        Grandchild: CSCI 121
```

Names are important. Phil Karlton once said that there are two hard things in computer science: cache invalidation, and naming things. With that in mind, remember that the people who will be trying to use these major specifications are not intimately familiar with the requirements of the major, and it would be quite kind of you to name things descriptively.

For that reason, we support abbreviating requirement names. If you end a requirement name with a phrase in parentheses, it will be treated as an abbreviation of the full requirement name, and can be used anywhere the full name can. Additionally, you may refer to a requirement with an abbreviation by the name without the abbreviation, or by the entire string—including parentheses.

Given the following requirement,

```yaml
Biblical Study (BTS-B):
    result: REL 111
```

you may refer to it as `Biblical Study (BTS-B)`, `Biblical Study`, or `BTS-B`.


## Advanced Expressions

When you need more power, you may reach for where-expressions, modifiers, and filters. With that said: *please* try and only use these in a last resort. Most majors can be expressed with only courses, boolean- and of-expressions, and requirement references.


### `where`-expressions

A where-expression is composed of two parts: a counter and a qualifier.

The counter is the same as in an of-expression; an English number between zero and twenty. A qualifier is made up of one or more qualifications, surrounded by curly braces.

A qualification is a `key`/`value` pair representing a property/value pair to look for. Qualifiers operate on a list of courses, filtering the list to only those courses which qualify.

The key/value pair must be separated by an operator. Valid operators are:

- `=`, "equals"
- `<`, "less-than"
- `<=`, "less-than-or-equal-to"
- `>`, "less-than"
- `>=`, "greater-than-or-equal-to"

**Warning:** The logic of any operator other than `=`, on value types other than numbers, has not been defined nor tested.

Qualifications may be separated by the boolean operator "and" (`&`) and/or the operator "or" (`|`). They may be grouped by parentheses. Normal boolean logic applies.

A set of `and`-separated qualifications will return the set of courses which matched *all* of the provided qualifications. A set of `or`-separated qualifications will return the set of courses which matched *any* of the provided qualifications.

An example `where`-expression is `one course where { gereqs = FYW }`. It will look for at least one course whose `gereqs` property is "FYW".

**Tip:** If the property in question is a list of values, as in the case of `gereqs`, it will check to see if the list contains the specified value.

The list of valid properties are:

- Dates: year, semester
- Organizational: department, number, section, lab, international
- Internal: clbid, crsid
- Miscellaneous: credits

In extreme cases, the value may be expressed as the result of a function run over another list of courses. So far, the only area of study that requires this amount of power are the degrees.

This looks like `{ year <= max(year) from courses where { gereqs = BTS-T } }`

*(TODO: make clearer.)* The value, in this case, is `max`, which is the name of a function to run on the values of the specified property from the list of courses which match the nested qualification.

You may also require that the resulting courses be "distinct" courses; that is, that they are not just different offerings of the same course. In other words, you can require that they be different *courses*, not just different *classes*.


### The `filter` key

Requirements may have another key, beyond just `result` and `message`. The `filter` key is an expression that filters the list of possible courses before it reaches `result`.

There are two types of `filter` values: `where`-expressions, and `of`-expressions. The difference between `filter` values and plain `of`- and `where`-expressions is that a `filter` cannot require a number of matches.

You can give it a `where`-expression:

```yaml
filter: only courses where { gereqs = FYW }
```

Now `result` will only know about the courses with a FYW gereq. Alternately, you can limit it to a whitelist of courses:

```yaml
filter: only courses from ( CSCI 111, 112, 123, 151, 167 )
```

Now `result` can only know about those five courses.


### Modifiers

Modifiers primarily exist to count things. They can count things from four different sources: *all* child requirements ("from children"), *some* child requirements ("from (Child, Child 2)"), the `filter` key ("from filter"), or from a new where-expression ("from courses where {}").

Modifiers can count three things from a source: the number of unique courses taken (not classes), the number of credits earned, and the number of unique departments.

These concepts are expressed like `<count> <thing> from <source>`. `count` may be an English number between zero and twenty.

```yaml
Child 1: CSCI 121
Child 2: ART 102
result: two courses from children
```

```yaml
A: one of (CSCI 121, 130)
B: one of (CHEM 101, 102, 103)
C: ART 102
result: two courses from (A, B) & C
```

```yaml
IST: one course where { gereqs = IST }
SED: one course where { gereqs = SED }
result: two departments from children & two courses from children
```

```yaml
filter: three of (ART 102, 105, 108)
result: three credits from filter
```


A special type of modifier is the "besides" modifier. It counts any course *except* for the one described by the modifier.

As such, `result: one course besides CHEM 398` would pass as long as the student has at least one course that is not CHEM 398.



### Variables

You might reach a point where you don't want to type a long list of courses several times.

We've got you covered! (But, please, use sparingly.)

You can declare variables under a `declare` key. These variables must be named in kebab-case (all-lowercase letters and numbers, with words separated by hyphens.)

You can only reference a variable from the level in which it was defined. Neither the parent level nor the child levels can see any other variables.

You can reference a variable from the `filter` and `result` keys.

To reference a variable, use '$' + [the name of the variable]. If the variable is named `draw`, you would refer to it by `$draw`.

A variable is, from the point of view of the program, simply a find/replace operation. It will replace the variable reference with the contents of the variable.

```yaml
declare:
    math-level-3: MATH 330, 340, 344, 348, 351, 356, 364, 382, 384
result:
    one of ($math-level-3, MATH 210)
```

is equivalent to

```yaml
result:
    one of (MATH 330, 340, 344, 348, 351, 356, 364, 382, 384, MATH 210)
```


## Formatting

Congratulations for having read this far! I think that's all of the concepts. So. With the hard-and-fast rules out of the way, let's think about some subjective ones for a minute: the formatting of the major specification file.

- Please indent each level by four spaces
- Try to limit the file to ~80 characters wide
- When of-expressions have, like, a bunch of options, put:
    - line-breaks before each change in department
    - a maximum of five courses on each line
    - subsequent lines of courses in the same department should be indented one space past the department name
    - a line break after the opening parenthesis
    - the closing parenthesis on the same line as the last course

{
  var globalLastDept

  function storeDept(dept) {
    globalLastDept = dept
  }

  function fetchDept(dept) {
    return globalLastDept
  }

  var flatten = require('lodash/flatten')
  var assign = require('lodash/assign')
}


Result
  = Or


Expression 'expression'
  = _ expr:(
      Not
    / Parenthetical
    / Course
    / Where
    / Occurrence
    / Of
    / Modifier
    / Reference
  ) _
  { return expr }


// Primitives

OptionalS
  = 's'?


Where
  = count:Counter _ distinct:IsDistinct _ 'course' OptionalS _ 'where' _ where:Qualifier
  { return {
      type: 'where',
      count: count,
      qualification: where,
      distinct: distinct,
  } }


Filter
  = 'only' _ distinct:IsDistinct _ 'courses' _ filter:(
      'where' _ where:Qualifier { return {where: where, type: 'FilterWhere'} }
    / 'from' _ ofList:OfCourseList { return {of: ofList, type: 'FilterOf'} }
  )
  { return {type: 'filter', ...filter, distinct: distinct} }


Occurrence
  = count:Counter _ 'occurrence' OptionalS _ 'of' _ course:Course
    { return {
        type: 'occurrence',
        count: count,
        course: course,
    } }


// Primitive Components

Qualifier
  = '{' _ q:OrQualification _ '}'
    { return q }


OrQualification 'qualification-or'
  = lhs:AndQualification _ '|' _ rhs:OrQualification
    { return {
      type: 'BooleanOr',
      values: [lhs, ...(rhs.values || [rhs])],
    } }
  / AndQualification


AndQualification 'qualification-and'
  = lhs:ParentheticalQualification _ '&' _ rhs:AndQualification
    { return {
      type: 'BooleanAnd',
      values: [lhs, ...(rhs.values || [rhs])],
    } }
  / ParentheticalQualification


ParentheticalQualification
  = OpenParen _ q:OrQualification _ CloseParen { return q }
  / Qualification


Qualification
  = key:QualificationField _
    op:Operator _
    value:(
        f:Function _ 'from' _ 'courses' _ 'where' _ q:Qualifier  { return {...f, qualification: q} }
      / word:QualificationValue
      / list:ParentheticalQualificationValue
    )
    { return {
        type: 'Qualification',
        key: key,
        operator: op,
        value: value,
    } }


ParentheticalQualificationValue
  = OpenParen _ value:OrQualificationValue _ CloseParen { return value }


OrQualificationValue
  = lhs:AndQualificationValue _ '|' _ rhs:OrQualificationValue
    { return {
      type: 'BooleanOr',
      values: [lhs, ...(rhs.values || [rhs])],
    } }
  / AndQualificationValue


AndQualificationValue
  = lhs:QualificationValue _ '&' _ rhs:AndQualificationValue
    { return {
      type: 'BooleanAnd',
      values: [lhs, ...(rhs.values || [rhs])],
    } }
  / QualificationValue


QualificationValue
  = num:Integer         { return {type: 'Number', value: num }}
  / word:[a-z0-9_\-]i+  { return {type: 'String', value: word.join('')} }


QualificationField
  = 'gereqs' / 'year' / 'department' / 'level'

Function
  = name:('max' / 'min') _ OpenParen _ prop:QualificationField _ CloseParen
    { return {
      name: name,
      prop: prop,
      type: 'function',
    } }


Operator
  = ('<=')       { return 'Lte' }
  / ('<')        { return 'Lt'  }
  / ('==' / '=') { return 'Eq'  }
  / ('>=')       { return 'Gte' }
  / ('>')        { return 'Gt'  }
  / ('!=')       { return 'Ne'  }


_ 'whitespace'
  = [ \n\t\r]*


Counter
  = count:EnglishInteger             { return { operator: 'Gte', num: count } }
  / 'at most' _ count:EnglishInteger { return { operator: 'Lte', num: count } }
  / 'exactly' _ count:EnglishInteger { return { operator: 'Eq',  num: count } }


EnglishInteger
  = num:(
        '0' / 'zero'
      / '1.5' / 'one-point-five'
      / '1' / 'one'
      / '2' / 'two'
      / '3' / 'three'
      / '4' / 'four'
      / '5' / 'five'
      / '6' / 'six'
      / '7' / 'seven'
      / '8' / 'eight'
      / '9' / 'nine'
      / '10' / 'ten'
    )
    {
           if (num === 'zero')  { return 0 }
      else if (num === 'one')   { return 1 }
      else if (num === 'one-point-five') { return 1.5 }
      else if (num === 'two')   { return 2 }
      else if (num === 'three') { return 3 }
      else if (num === 'four')  { return 4 }
      else if (num === 'five')  { return 5 }
      else if (num === 'six')   { return 6 }
      else if (num === 'seven') { return 7 }
      else if (num === 'eight') { return 8 }
      else if (num === 'nine')  { return 9 }
      else if (num === 'ten')   { return 10 }
      else
        throw new Error(`invalid number "${num}"`)
    }


// Expressions

Not
  = '!' _ value:Expression
    { return {
      type: 'BooleanNot',
      not: value
    } }


Parenthetical
  = OpenParen _ value:Result _ CloseParen
    { return value }

Or
  = lhs:And _ '|' _ rhs:Or
    { return {
      type: 'BooleanOr',
      values: [lhs, ...(rhs.values || [rhs])],
    } }
  / And


And
  = lhs:Expression _ '&' _ rhs:And
    { return {
      type: 'BooleanAnd',
      values: [lhs, ...(rhs.values || [rhs])],
    } }
  / Expression


OfCourseList
  = OpenParen _ ofItems:(
      val:Course
      rest:( _ ',' _ second:Course { return second } )*
      { return [val].concat(rest) }
    )+ _ ','? _ CloseParen
  { return flatten(ofItems) }


OfList
  = OpenParen _ ofItems:(
      val:Result
      rest:( _ ',' _ second:Result { return second } )*
      { return [val].concat(rest) }
    )+ _ ','? _ CloseParen
  { return flatten(ofItems) }


Of
  = count:(
        Counter
      / 'all'  { return { operator: 'Eq', was: 'All' } }
      / 'any'  { return { operator: 'Gte', num: 1, was: 'Any' } }
      / 'none' { return { operator: 'Eq', num: 0, was: 'None' } }
    )
    _ 'of' _ ofList:OfList
    {
      if (count.was === 'all') {
        count.num = ofList.length
      }

      if (ofList.length < count.num) {
        throw new Error(`you requested ${count.num} items, but only gave ${ofList.length} options (${JSON.stringify(ofList)}).`)
      }

      return {
        type: 'Of',
        count: count,
        of: ofList,
      }
    }


ChildList  // select a few requirements to apply the modifier to.
  = OpenParen _ reqs:(
    val:Reference
    rest:( _ ',' _ second:Reference { return second } )*
    { return [val, ...rest] }
  )+ _ ','? _ CloseParen
  { return flatten(reqs) }


Modifier
  = count:Counter _
    what:(
        'course'
      / 'credit'
      / 'department'
      / 'term'
    ) OptionalS _ besides:Besides? _ 'from' _
    from:(
        'children' _ 'where' _ where:Qualifier { return { from: 'ChildrenWhere', qualification: where, children: '$all' } }
      / 'children'                             { return { from: 'Children', children: '$all' }}
      / 'filter' _ 'where' _ where:Qualifier   { return { from: 'FilterWhere', qualification: where }}
      / 'filter'                               { return { from: 'Filter' }}
      / 'courses' _ 'where' _ where:Qualifier  { return { from: 'Where', qualification: where } }
      / c:ChildList _ 'where' _ w:Qualifier    { return { from: 'ChildrenWhere', qualification: w, children: c } }
      / children:ChildList                     { return { from: 'Children', children: children} }  // an alternative to "from [all] children"
      / child:Reference                        { return { from: 'Children', children: [child]} }
    )
    {
      if (from.from === 'where' && what === 'department') {
        throw new Error('cannot use a modifier with "departments" or "department"')
      }
      if (from.from === 'where' && what === 'term') {
        throw new Error('cannot use a modifier with "terms" or "term"')
      }
      if (from.from === 'children-where' && what !== 'course') {
        throw new Error('must use "courses from" with "children where"')
      }
      if (count.operator !== 'Gte' && what !== 'course') {
        throw new Error('can only use at-least style counters with non-course requests')
      }

      what = what[0].toUpperCase() + what.slice(1)

      let result = {
        ...from,
        type: 'Modifier',
        count: count,
        what: what,
      }
      if (besides) {
        result.besides = besides
      }
      return result
    }


Besides
  = 'besides' _ course:Course { return course }


RequirementTitle
  = title:(
      initial:[A-Z0-9]
      rest:[A-Za-z0-9_\- /'.]*
      { return initial + rest.join('') }
    )
    { return title.trim() }


Reference 'requirement reference'
  = title:(
      a:RequirementTitle
      b:(_ OpenParen t:RequirementTitle CloseParen { return ` (${t})` })?
      { return `${a}${b || ''}` }
    )
    {
      if (options.abbreviations && title in options.abbreviations) {
        title = options.abbreviations[title]
      }
      else if (options.titles && title in options.titles) {
        title = options.titles[title]
      }
      return {
        type: 'Reference',
        requirement: title,
      }
    }


// Course

Course
  = dept:CourseDepartment? _
    num:CourseNumber
    details:(
      '.' year:CourseYear sub:(
        '.' semester:CourseSemester { return {semester} }
      )? { return assign({}, sub, {year}) }
    )?
  {
    return {
      type: 'Course',
      ...details,
      ...(dept || fetchDept()),
      ...num,
    }
  }


CourseDepartment
  = dept:[A-Z/]+
    {
      let department = {department: dept.join('').split('/')}
      storeDept(department)
      return department
    }


CourseNumber 'course number'
  = nums:(Digit Digit Digit)
    international:'I'? lab:'L'?
    {
      let result = {}

      let number = parseInt(nums.join(''))

      if (international) {
        result.international = true
      }
      if (lab) {
        result.type = 'Lab'
      }

      return assign({}, result, {number})
    }


CourseYear
  = nums:(Digit Digit Digit Digit)
    { return parseInt(nums.join('')) }
  / Asterisk
  / Else { throw new SyntaxError('A course year must be either a four-digit year [e.g. 1994] or an asterisk [*].')}


CourseSemester
  = num:[1-5] { return parseInt(num) }
  / Asterisk
  / Else { throw new SyntaxError('A course semester must be either a number between 1 [Fall] and 5 [Summer Session 2], or an asterisk [*].')}


// Primitives

Else
  = .+


UppercaseLetter
  = char:[A-Z]
    { return char }


Asterisk
  = '*'


Word
  = chars:[a-z]i+
    { return chars.join('') }


Integer
  = digits:Digit+
    { return parseInt(digits.join('')) }


Digit
  = num:[0-9]
    { return parseInt(num) }


OpenParen
  = '('


CloseParen
  = ')'


IsDistinct
  = d:'distinct'?
  { return Boolean(d) }

{
  let globalLastDept

  function storeDept(dept) {
    globalLastDept = dept
  }

  function fetchDept(dept) {
    return globalLastDept
  }

  const flatten = require('lodash/flatten')
  const expandDepartment = require('./convert-department').expandDepartment
}


Start
  = Or


Expression 'expression'
  = _ expr:(
      Not
    / Parenthetical
    / Course
    / Where
    / Filter
    / Occurrence
    / Of
    / Modifier
    / Besides
    / Reference
  ) _
  { return expr }


// Primitives

OptionalS
  = 's'?


Where
  = count:Counter _ distinct:IsDistinct _ 'course' OptionalS _ 'where' _ where:Qualifier
  { return {
      $type: 'where',
      $count: count,
      $where: where,
      $distinct: distinct,
  } }


Filter
  = 'only' _ distinct:IsDistinct _ 'courses' _ filter:(
      'where' _ where:Qualifier { return {$where: where} }
    / 'from' _ of:OfList { return {$of: of} }
  )
  { return {...filter, $distinct: distinct, $type: 'filter'} }


Occurrence
  = count:Counter _ 'occurrence' OptionalS _ 'of' _ course:Course
    { return {
        $type: 'occurrence',
        $count: count,
        $course: course.$course,
    } }


// Primitive Components

Qualifier
  = '{' _ q:OrQualification _ '}'
    { return q }


OrQualification 'qualification-or'
  = lhs:AndQualification _ '|' _ rhs:OrQualification
    { return {
      $type: 'boolean',
      $or: [lhs].concat('$or' in rhs ? rhs.$or : [rhs]),
    } }
  / AndQualification


AndQualification 'qualification-and'
  = lhs:ParentheticalQualification _ '&' _ rhs:AndQualification
    { return {
      $type: 'boolean',
      $and: [lhs].concat('$and' in rhs ? rhs.$and : [rhs]),
    } }
  / ParentheticalQualification


ParentheticalQualification
  = OpenParen _ q:OrQualification _ CloseParen { return q }
  / Qualification


Qualification
  = key:Word _
    op:Operator _
    value:(
        f:Function _ 'from' _ 'courses' _ 'where' _ q:Qualifier  { return {...f, $where: q} }
      / word:QualificationValue
      / list:ParentheticalQualificationValue
    )
    { return {
        $type: 'qualification',
        $key: key,
        $operator: op,
        $value: value,
    } }


ParentheticalQualificationValue
  = OpenParen _ value:OrQualificationValue _ CloseParen { return value }


OrQualificationValue
  = lhs:AndQualificationValue _ '|' _ rhs:OrQualificationValue
    { return {
      $type: 'boolean',
      $or: [lhs].concat(rhs.$or ? rhs.$or : [rhs]),
    } }
  / AndQualificationValue


AndQualificationValue
  = lhs:QualificationValue _ '&' _ rhs:AndQualificationValue
    { return {
      $type: 'boolean',
      $and: [lhs].concat(rhs.$and ? rhs.$and : [rhs]),
    } }
  / QualificationValue


QualificationValue
  = num:Integer         { return num }
  / word:[a-z0-9_\-]i+  { return word.join('') }


Function
  = name:Word _ OpenParen _ prop:Word _ CloseParen
    { return {
      $name: name,
      $prop: prop,
      $type: 'function',
    } }


Operator
  = ('<=')       { return '$lte' }
  / ('<')        { return '$lt'  }
  / ('==' / '=') { return '$eq'  }
  / ('>=')       { return '$gte' }
  / ('>')        { return '$gt'  }
  / ('!=')       { return '$ne'  }


_ 'whitespace'
  = [ \n\t\r]*


Counter
  = count:EnglishInteger             { return { $operator: '$gte', $num: count } }
  / 'at most' _ count:EnglishInteger { return { $operator: '$lte', $num: count } }
  / 'exactly' _ count:EnglishInteger { return { $operator: '$eq',  $num: count } }


EnglishInteger
  = num:(
        'zero'
      / 'one'
      / 'two'
      / 'three'
      / 'four'
      / 'five'
      / 'six'
      / 'seven'
      / 'eight'
      / 'nine'
      / 'ten'
    )
    {
           if (num === 'zero')  { return 0 }
      else if (num === 'one')   { return 1 }
      else if (num === 'two')   { return 2 }
      else if (num === 'three') { return 3 }
      else if (num === 'four')  { return 4 }
      else if (num === 'five')  { return 5 }
      else if (num === 'six')   { return 6 }
      else if (num === 'seven') { return 7 }
      else if (num === 'eight') { return 8 }
      else if (num === 'nine')  { return 9 }
      else if (num === 'ten')   { return 10 }
    }


// Expressions

Not
  = '!' _ value:Expression
    { return {
      $type: 'boolean',
      $not: value
    } }


Parenthetical
  = OpenParen _ value:Start _ CloseParen
    { return value }

Or
  = lhs:And _ '|' _ rhs:Or
    { return {
      $type: 'boolean',
      $or: [lhs].concat('$or' in rhs ? rhs.$or : [rhs]),
    } }
  / And


And
  = lhs:Expression _ '&' _ rhs:And
    { return {
      $type: 'boolean',
      $and: [lhs].concat('$and' in rhs ? rhs.$and : [rhs]),
    } }
  / Expression


OfList
  = OpenParen _ of:(
      val:Start
      rest:( _ ',' _ second:Start { return second } )*
      { return [val].concat(rest) }
    )+ _ ','? _ CloseParen
  { return flatten(of) }


Of
  = count:(
        Counter
      / 'all'  { return { $operator: '$eq', $was: 'all' } }
      / 'any'  { return { $operator: '$gte', $num: 1, $was: 'any' } }
      / 'none' { return { $operator: '$eq', $num: 0, $was: 'none' } }
    )
    _ 'of' _ of:OfList
    {
      if (count.$was === 'all') {
        count.$num = of.length
      }

      if (of.length < count.$num) {
        throw new Error(`you requested ${count.$num} items, but only gave ${of.length} options (${JSON.stringify(of)}).`)
      }

      return {
        $type: 'of',
        $count: count,
        $of: of,
      }
    }


ChildList  // select a few requirements to apply the modifier to.
  = OpenParen _ reqs:(
    val:Reference
    rest:( _ ',' _ second:Reference { return second } )*
    { return [val].concat(rest) }
  )+ _ ','? _ CloseParen
  { return flatten(reqs) }


Modifier
  = count:Counter _
    what:(
        'course'
      / 'credit'
      / 'department'
    ) OptionalS _ besides:Besides? _ 'from' _
    from:(
        'children' _ 'where' _ where:Qualifier { return { $from: 'children-where', $where: where, $children: '$all' } }
      / 'children'                             { return { $from: 'children', $children: '$all' }}
      / 'filter' _ 'where' _ where:Qualifier   { return { $from: 'filter-where', $where: where }}
      / 'filter'                               { return { $from: 'filter' }}
      / 'courses' _ 'where' _ where:Qualifier  { return { $from: 'where', $where: where } }
      / c:ChildList _ 'where' _ w:Qualifier    { return { $from: 'children-where', $where: w, $children: c } }
      / children:ChildList                     { return { $from: 'children', $children: children} }  // an alternative to "from [all] children"
      / child:Reference                        { return { $from: 'children', $children: [child]} }
    )
    {
      if (from.$from === 'where' && what === 'department') {
        throw new Error('cannot use a modifier with "departments"')
      }
      if (from.$from === 'children-where' && what !== 'course') {
        throw new Error('must use "courses from" with "children where"')
      }
      if (count.$operator !== '$gte' && what !== 'course') {
        throw new Error('can only use at-least style counters with non-course requests')
      }
      let result = {
        ...from,
        $type: 'modifier',
        $count: count,
        $what: what,
      }
      if (besides) {
        result.$besides = besides
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
        $type: 'reference',
        $requirement: title,
      }
    }


// Course

Course
  = dept:CourseDepartment? _
    num:CourseNumber
    details:(
      '.' section:CourseSection sub:(
        '.' year:CourseYear sub:(
          '.' semester:CourseSemester { return {semester} }
        )? { return {...sub, year} }
      )? { return {...sub, section} }
    )?
  {
    return {
      $type: 'course',
      $course: {
        ...details,
        ...(dept || fetchDept()),
        ...num
      },
    }
  }


CourseDepartment
  = dept1:(c1:UppercaseLetter c2:UppercaseLetter { return c1 + c2 })
    part2:(
      '/' l1:UppercaseLetter l2:UppercaseLetter
          { return {dept: l1 + l2, type: 'seperate'} }
      / chars:UppercaseLetter*
          { return {dept: chars.join(''), type: 'joined'} }
    )
    {
      const {type, dept: dept2} = part2
      let department
      if (type === 'joined') {
        department = {department: [dept1 + dept2]}
      }
      else if (type === 'seperate') {
        department = {department: [
          expandDepartment(dept1),
          expandDepartment(dept2),
        ]}
      }
      storeDept(department)
      return department
    }


CourseNumber 'course number'
  = num:(
        nums:(Digit Digit Digit)
          { return {number: parseInt(nums.join(''))} }
      / num:Digit 'XX'
          { return {level: num * 100} }
    )
    international:'I'? lab:'L'?
    {
      let result = {}

      if (international) {
        result.international = true
      }
      if (lab) {
        result.type = 'Lab'
      }

      return {...result, ...num}
    }


CourseSection
  = UppercaseLetter
  / Asterisk
  / Else { throw new SyntaxError('A course section must be either an uppercase letter [A-Z] or an asterisk [*].')}


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

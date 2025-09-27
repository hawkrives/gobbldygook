# Comprehensive Testing Strategies for React Applications

This guide provides detailed testing strategies and best practices specifically for the Gobbldygook React application, designed for AI coding assistants working on this educational course scheduling platform.

## Testing Framework Overview

### Jest Configuration

Gobbldygook uses Jest as the primary testing framework with specific configuration:

- **Test environment**: jsdom (simulates browser environment)
- **Coverage reporting**: Comprehensive coverage tracking required
- **Parallel execution**: Use `--runInBand` flag for consistent results
- **Test timeout**: Extended for complex operations

### Current Test Statistics

- **94 test suites** with **561 tests total**
- **4 suites skipped** (legacy or deprecated functionality)  
- **18 tests skipped** (known issues or environment-specific)
- **Coverage requirements**: Maintain current coverage levels
- **Execution time**: ~20 seconds for full test suite

## Test File Organization

### Directory Structure

```
modules/module-name/
├── __tests__/              # Test files
│   ├── component.test.js   # Component tests
│   ├── utils.test.js       # Utility function tests
│   └── integration.test.js # Integration tests
├── source/                 # Source code
└── package.json
```

### Naming Conventions

- **Test files**: `*.test.js` or `*.spec.js`
- **Test descriptions**: Descriptive, behavior-focused names
- **Test groups**: Logical grouping with `describe` blocks

## React Component Testing

### Component Test Structure

```javascript
// @flow

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CourseCard from '../course-card'

describe('CourseCard', () => {
  const mockCourse = {
    id: 'CSCI121',
    title: 'Computer Science I',
    credits: 4,
    description: 'Introduction to programming',
  }

  it('should render course information correctly', () => {
    render(<CourseCard course={mockCourse} />)
    
    expect(screen.getByText('CSCI121')).toBeInTheDocument()
    expect(screen.getByText('Computer Science I')).toBeInTheDocument()
    expect(screen.getByText('4 credits')).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = jest.fn()
    render(<CourseCard course={mockCourse} onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledWith(mockCourse)
    })
  })
})
```

### Testing React Hooks

```javascript
import { renderHook, act } from '@testing-library/react'
import useStudentData from '../use-student-data'

describe('useStudentData', () => {
  it('should load student data on mount', async () => {
    const { result } = renderHook(() => useStudentData('student-123'))
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.student).toBeDefined()
    })
  })

  it('should handle data updates', async () => {
    const { result } = renderHook(() => useStudentData('student-123'))
    
    await act(async () => {
      result.current.updateStudent({ name: 'Updated Name' })
    })
    
    expect(result.current.student.name).toBe('Updated Name')
  })
})
```

### Redux Store Testing

```javascript
import { createStore } from 'redux'
import rootReducer from '../reducers'
import { addCourse, removeCourse } from '../actions'

describe('course reducer', () => {
  let store

  beforeEach(() => {
    store = createStore(rootReducer)
  })

  it('should add course to schedule', () => {
    const course = { id: 'CSCI121', title: 'Computer Science I' }
    
    store.dispatch(addCourse('fall-2023', course))
    
    const state = store.getState()
    expect(state.schedules['fall-2023'].courses).toContain(course)
  })

  it('should remove course from schedule', () => {
    const course = { id: 'CSCI121', title: 'Computer Science I' }
    store.dispatch(addCourse('fall-2023', course))
    
    store.dispatch(removeCourse('fall-2023', course.id))
    
    const state = store.getState()
    expect(state.schedules['fall-2023'].courses).not.toContain(course)
  })
})
```

## Testing Complex Business Logic

### Student Evaluation Testing

```javascript
import { evaluate } from '@gob/examine-student'

describe('student evaluation', () => {
  const mockStudent = {
    courses: [
      { id: 'CSCI121', credits: 4, grade: 'A' },
      { id: 'CSCI251', credits: 4, grade: 'B+' },
    ],
    areas: ['Computer Science Major'],
  }

  const mockRequirements = {
    'Computer Science Major': {
      type: 'major',
      requirements: [
        { type: 'course', course: 'CSCI121' },
        { type: 'course', course: 'CSCI251' },
      ],
    },
  }

  it('should evaluate student progress correctly', () => {
    const result = evaluate(mockStudent, mockRequirements)
    
    expect(result.canGraduate).toBe(true)
    expect(result.areas['Computer Science Major'].computed).toBe(true)
  })

  it('should handle missing requirements', () => {
    const incompleteStudent = {
      ...mockStudent,
      courses: [{ id: 'CSCI121', credits: 4, grade: 'A' }],
    }
    
    const result = evaluate(incompleteStudent, mockRequirements)
    
    expect(result.canGraduate).toBe(false)
    expect(result.areas['Computer Science Major'].computed).toBe(false)
  })
})
```

### Course Search and Filtering

```javascript
import { searchCourses, filterCourses } from '@gob/search-queries'

describe('course search functionality', () => {
  const mockCourses = [
    { id: 'CSCI121', title: 'Computer Science I', department: 'CSCI' },
    { id: 'CSCI251', title: 'Software Design', department: 'CSCI' },
    { id: 'MATH120', title: 'Calculus I', department: 'MATH' },
  ]

  it('should search courses by title', () => {
    const results = searchCourses(mockCourses, 'Computer')
    
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('CSCI121')
  })

  it('should filter courses by department', () => {
    const results = filterCourses(mockCourses, { department: 'CSCI' })
    
    expect(results).toHaveLength(2)
    expect(results.every(course => course.department === 'CSCI')).toBe(true)
  })

  it('should handle empty search results', () => {
    const results = searchCourses(mockCourses, 'NonexistentCourse')
    
    expect(results).toHaveLength(0)
  })
})
```

## Asynchronous Testing

### IndexedDB Operations

```javascript
import { openDB } from 'idb'
import { saveCourseData, loadCourseData } from '../database'

describe('database operations', () => {
  let db

  beforeEach(async () => {
    // Setup test database
    db = await openDB('test-gobbldygook', 1, {
      upgrade(db) {
        db.createObjectStore('courses', { keyPath: 'id' })
      },
    })
  })

  afterEach(async () => {
    // Cleanup test database
    await db.close()
    await indexedDB.deleteDatabase('test-gobbldygook')
  })

  it('should save and load course data', async () => {
    const courseData = [
      { id: 'CSCI121', title: 'Computer Science I' },
      { id: 'CSCI251', title: 'Software Design' },
    ]

    await saveCourseData(db, courseData)
    const loadedData = await loadCourseData(db)

    expect(loadedData).toEqual(courseData)
  })

  it('should handle database errors gracefully', async () => {
    const invalidData = null

    await expect(saveCourseData(db, invalidData)).rejects.toThrow()
  })
})
```

### Web Worker Testing

```javascript
import CheckStudentWorker from '../check-student.worker.js'

describe('CheckStudentWorker', () => {
  let worker

  beforeEach(() => {
    worker = new CheckStudentWorker()
  })

  afterEach(() => {
    worker.terminate()
  })

  it('should process student evaluation in background', (done) => {
    const studentData = {
      courses: [{ id: 'CSCI121', credits: 4 }],
      areas: ['Computer Science Major'],
    }

    worker.postMessage({ type: 'EVALUATE_STUDENT', data: studentData })

    worker.onmessage = (event) => {
      const { type, result } = event.data
      
      expect(type).toBe('EVALUATION_COMPLETE')
      expect(result.canGraduate).toBeDefined()
      done()
    }
  })

  it('should handle worker errors', (done) => {
    worker.postMessage({ type: 'INVALID_ACTION' })

    worker.onerror = (error) => {
      expect(error).toBeDefined()
      done()
    }
  })
})
```

## Integration Testing

### End-to-End User Workflows

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from '../App'
import rootReducer from '../reducers'

describe('Student Planning Workflow', () => {
  let store

  beforeEach(() => {
    store = createStore(rootReducer)
  })

  it('should allow complete student planning workflow', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    // Create new student
    fireEvent.click(screen.getByText('New Student'))
    fireEvent.change(screen.getByLabelText('Student Name'), {
      target: { value: 'Test Student' }
    })
    fireEvent.click(screen.getByText('Create Student'))

    // Add area of study
    await waitFor(() => {
      expect(screen.getByText('Test Student')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add Major'))
    fireEvent.click(screen.getByText('Computer Science'))

    // Add course to schedule
    fireEvent.click(screen.getByText('Fall 2023'))
    fireEvent.click(screen.getByText('Add Course'))
    
    const courseSearch = screen.getByPlaceholderText('Search courses')
    fireEvent.change(courseSearch, { target: { value: 'CSCI121' } })
    
    await waitFor(() => {
      expect(screen.getByText('Computer Science I')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Computer Science I'))

    // Verify course was added
    expect(screen.getByText('CSCI121')).toBeInTheDocument()
  })
})
```

### Module Integration Testing

```javascript
import { convertStudent } from '@gob/school-st-olaf-college-sis-import'
import { evaluate } from '@gob/examine-student'

describe('SIS Import to Evaluation Pipeline', () => {
  it('should convert SIS data and evaluate student', async () => {
    const sisData = {
      name: 'Test Student',
      courses: [
        { course_id: 'CSCI 121', credits: '4.00', grade: 'A' },
      ],
      areas: ['Computer Science'],
    }

    // Convert SIS data to internal format
    const student = await convertStudent(sisData, mockGetCourse)
    
    expect(student.courses).toHaveLength(1)
    expect(student.courses[0].id).toBe('CSCI121')

    // Evaluate converted student
    const evaluation = evaluate(student, mockRequirements)
    
    expect(evaluation).toBeDefined()
    expect(evaluation.areas).toHaveProperty('Computer Science')
  })
})
```

## Performance Testing

### Render Performance

```javascript
import { render } from '@testing-library/react'
import StudentSchedule from '../StudentSchedule'

describe('StudentSchedule Performance', () => {
  it('should render large course lists efficiently', () => {
    const largeCourseList = Array.from({ length: 100 }, (_, i) => ({
      id: `COURSE${i}`,
      title: `Course ${i}`,
      credits: 4,
    }))

    const start = performance.now()
    render(<StudentSchedule courses={largeCourseList} />)
    const end = performance.now()

    // Should render within reasonable time
    expect(end - start).toBeLessThan(100) // 100ms threshold
  })
})
```

### Memory Leak Testing

```javascript
describe('Memory Management', () => {
  it('should cleanup event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = render(<ComponentWithEventListeners />)
    
    expect(addEventListenerSpy).toHaveBeenCalled()
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(
      addEventListenerSpy.mock.calls.length
    )
  })
})
```

## Test Utilities and Helpers

### Custom Render Function

```javascript
// test-utils.js
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from '../reducers'

export function renderWithStore(
  component,
  { initialState = {}, store = createStore(rootReducer, initialState) } = {}
) {
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store,
  }
}
```

### Mock Data Factories

```javascript
// mock-factories.js
export const createMockCourse = (overrides = {}) => ({
  id: 'CSCI121',
  title: 'Computer Science I',
  credits: 4,
  description: 'Introduction to programming',
  prerequisites: [],
  ...overrides,
})

export const createMockStudent = (overrides = {}) => ({
  id: 'student-123',
  name: 'Test Student',
  courses: [],
  areas: [],
  schedules: {},
  ...overrides,
})
```

## Testing Best Practices

### Test Organization

1. **Group related tests**: Use `describe` blocks for logical grouping
2. **Clear test names**: Describe the expected behavior, not implementation
3. **Setup and teardown**: Use `beforeEach`/`afterEach` for consistent state
4. **Test isolation**: Each test should be independent

### Assertion Strategies

1. **Specific assertions**: Test exact expected values when possible
2. **Behavior testing**: Focus on user-visible behavior over implementation
3. **Error handling**: Test both success and failure cases
4. **Edge cases**: Test boundary conditions and invalid inputs

### Mock Usage Guidelines

1. **Mock external dependencies**: APIs, databases, third-party libraries
2. **Preserve behavior**: Mocks should reflect real dependency behavior
3. **Minimal mocking**: Only mock what's necessary for the test
4. **Mock verification**: Verify mocks are called correctly

### Coverage Requirements

1. **Statement coverage**: All code paths should be executed
2. **Branch coverage**: All conditional branches should be tested
3. **Function coverage**: All functions should be called in tests
4. **Line coverage**: All lines should be covered by tests

### Running Tests Effectively

```bash
# Run full test suite with coverage
./node_modules/.bin/jest --runInBand --coverage

# Run specific test file
./node_modules/.bin/jest modules/gob-web/__tests__/component.test.js --runInBand

# Run tests in watch mode during development
./node_modules/.bin/jest --watch --runInBand

# Run tests with verbose output for debugging
./node_modules/.bin/jest --verbose --runInBand
```

### Debugging Failed Tests

1. **Use `screen.debug()`**: Print component DOM for inspection
2. **Add console.log statements**: Temporary debugging output
3. **Check async operations**: Ensure proper `await` and `waitFor` usage
4. **Verify test data**: Confirm mock data matches expected format
5. **Check error messages**: Jest provides detailed failure information
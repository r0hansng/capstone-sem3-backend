# Testing Guide for Resume Builder Backend

This directory contains comprehensive unit and integration tests for the Resume Builder backend server.

## Project Structure

```
tests/
├── unit/                           # Unit tests for individual components
│   ├── user.model.test.js         # Tests for User model methods
│   ├── resume.model.test.js       # Tests for Resume schema validation
│   ├── auth.middleware.test.js    # Tests for JWT authentication middleware
│   ├── user.controller.test.js    # Tests for user-related endpoints
│   ├── resume.controller.test.js  # Tests for resume-related endpoints
│   └── ai.controller.test.js      # Tests for AI enhancement endpoints
└── integration/
    └── integration.test.js         # Tests for component integration
```

## Setup and Installation

### 1. Install Testing Dependencies

The required testing dependencies have been added to `package.json`:
- **jest**: JavaScript testing framework
- **supertest**: HTTP assertion library for testing API endpoints

```bash
npm install
```

### 2. Test Scripts

Several npm scripts are available:

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### Unit Tests

#### Models
- **user.model.test.js**
  - Password comparison functionality
  - Hash validation
  - Password mismatch handling

- **resume.model.test.js**
  - Schema field validation
  - Default values
  - Array field types
  - Nested object structures

#### Middleware
- **auth.middleware.test.js**
  - Bearer token extraction
  - JWT verification
  - Token expiration handling
  - Missing authorization header handling
  - Token error handling

#### Controllers
- **user.controller.test.js**
  - User registration with validation
  - User login with password verification
  - User retrieval by ID
  - Error handling and edge cases
  - Password exclusion from responses
  - JWT token generation

- **resume.controller.test.js**
  - Resume creation
  - Resume deletion with ownership validation
  - Resume retrieval (private and public)
  - Resume updates
  - Database error handling

- **ai.controller.test.js**
  - Professional summary enhancement
  - Job description enhancement
  - Resume text extraction
  - Content validation
  - AI API integration testing

### Integration Tests

- **integration.test.js**
  - Authentication flow (token generation and verification)
  - Resume management operations
  - Error handling across components
  - Concurrent operations
  - Multi-user scenarios

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test -- tests/unit/user.controller.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should register user successfully"
```

### Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

## Test Examples

### Testing User Registration
```javascript
test('should register user successfully', async () => {
    const response = await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            message: 'User registered successfully',
            token: expect.any(String)
        })
    );
});
```

### Testing Authentication Middleware
```javascript
test('should extract token from Bearer format', () => {
    req.headers.authorization = `Bearer ${testToken}`;
    jwt.verify.mockReturnValue({ userId });

    protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(testToken, 'test-secret-key');
    expect(next).toHaveBeenCalled();
});
```

### Testing Resume Operations
```javascript
test('should create resume successfully', async () => {
    Resume.create.mockResolvedValue(mockResume);

    await createResume(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
        message: 'Resume created successfully',
        resume: mockResume
    });
});
```

## Mocking Strategy

The tests use Jest mocking to simulate:

1. **Database Models**: MongoDB operations are mocked to isolate controller logic
2. **External APIs**: OpenAI and ImageKit APIs are mocked
3. **Security Libraries**: JWT and bcrypt are mocked for deterministic testing
4. **File System**: File operations are mocked to avoid I/O

### Creating Mocks

```javascript
// Mock a module
jest.mock('../../models/user.model.js');

// Mock specific functions
User.findOne.mockResolvedValue(mockUser);
User.create.mockRejectedValue(new Error('Database error'));
```

## Best Practices

1. **Isolation**: Each unit test is independent and doesn't depend on others
2. **Clarity**: Test names clearly describe what is being tested
3. **Coverage**: All error paths and edge cases are covered
4. **Mocking**: External dependencies are mocked to ensure fast execution
5. **Assertions**: Multiple assertions verify complete behavior
6. **Setup/Teardown**: beforeEach and afterEach clean up test state

## Continuous Integration

To integrate tests with CI/CD:

```bash
# In your CI configuration
npm test -- --coverage --passWithNoTests
```

## Troubleshooting

### Tests Won't Run
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (12.x or higher required)
- Clear Jest cache: `npm test -- --clearCache`

### Module Not Found Errors
- Check that mock paths match actual file locations
- Ensure imports use correct relative paths

### Timeout Errors
- Increase timeout in jest.config: `testTimeout: 10000`
- Check for unresolved promises in tests

### Coverage Issues
- Run `npm run test:coverage` to identify untested lines
- Add tests for uncovered code paths

## Adding New Tests

When adding new features:

1. Create corresponding test file in `tests/unit/` or `tests/integration/`
2. Follow the naming convention: `[feature].test.js`
3. Mock external dependencies
4. Test success paths and error scenarios
5. Verify error messages and status codes
6. Run `npm run test:coverage` to ensure coverage

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Contributing

When contributing new code:

1. Write tests first (TDD approach recommended)
2. Ensure all tests pass: `npm test`
3. Maintain or improve code coverage
4. Follow the existing test structure and naming conventions
5. Add integration tests for multi-component features

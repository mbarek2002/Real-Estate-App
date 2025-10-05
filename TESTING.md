# Real Estate App - Comprehensive Testing Guide

This document outlines the comprehensive testing strategy for the Real Estate App, covering all major functionality and integration points.

## 🧪 Test Categories

### 1. Unit Tests

- **Components**: Individual React components (Header, PropertyCard, etc.)
- **Services**: API service functions and utilities
- **Context**: App context and state management
- **Utils**: Helper functions and utilities

### 2. Integration Tests

- **API Integration**: Backend API connectivity and data flow
- **Component Integration**: Component interactions and data passing
- **User Workflows**: Complete user journeys from start to finish

### 3. End-to-End Tests

- **Authentication Flow**: Registration → Login → Profile
- **Property Management**: Search → View → Request Visit
- **Admin Functions**: Property management and user administration

## 🚀 Running Tests

### Quick Start

```bash
# Run all tests
npm run test:all

# Run only unit tests with coverage
npm run test:coverage

# Run only functionality tests
npm run test:functionality

# Run tests in watch mode
npm test
```

### Individual Test Categories

```bash
# Run specific test files
npm test -- --testPathPattern=Header.test.js
npm test -- --testPathPattern=PropertyCard.test.js
npm test -- --testPathPattern=integration.test.js
```

## 📋 Test Coverage

### Authentication Tests

- ✅ User Registration
- ✅ User Login
- ✅ Profile Management
- ✅ Password Updates
- ✅ Session Management

### Property Management Tests

- ✅ Property CRUD Operations
- ✅ Property Search and Filtering
- ✅ Location-based Discovery
- ✅ Property View Tracking
- ✅ Image Upload and Management

### Search and Filter Tests

- ✅ Text-based Search
- ✅ Location-based Search
- ✅ Price Range Filtering
- ✅ Property Type Filtering
- ✅ Amenity Filtering
- ✅ Advanced Search Options

### Visit Request Tests

- ✅ Create Visit Request
- ✅ View Sent Requests
- ✅ View Received Requests
- ✅ Approve/Reject Requests
- ✅ Update Request Details
- ✅ Delete Requests

### Favorites Tests

- ✅ Add to Favorites
- ✅ Remove from Favorites
- ✅ View Favorites List
- ✅ Favorites Persistence

### News Tests

- ✅ Get All News
- ✅ Get News by ID
- ✅ News Display
- ✅ News Filtering

### UI/UX Tests

- ✅ Component Rendering
- ✅ User Interactions
- ✅ Responsive Design
- ✅ Accessibility
- ✅ Performance

## 🔧 Test Configuration

### Jest Configuration

```javascript
// setupTests.js
import "@testing-library/jest-dom";

// Mock configurations for:
// - Leaflet maps
// - Geolocation API
// - Fetch API
// - React Router
```

### Test Environment Variables

```bash
# .env.test
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_TEST_MODE=true
```

## 📊 Test Results

### Coverage Targets

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Performance Benchmarks

- **Component Render Time**: < 100ms
- **API Response Time**: < 500ms
- **Page Load Time**: < 2s
- **Bundle Size**: < 1MB

## 🐛 Common Test Issues and Solutions

### 1. Map Component Testing

**Issue**: Leaflet components don't render in test environment
**Solution**: Mock Leaflet and react-leaflet components

```javascript
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
}));
```

### 2. API Testing

**Issue**: Network requests fail in test environment
**Solution**: Mock fetch API and API responses

```javascript
global.fetch = jest.fn();
fetch.mockResolvedValue({
  ok: true,
  json: async () => mockData,
});
```

### 3. Context Testing

**Issue**: Components fail when context is not provided
**Solution**: Wrap components in test providers

```javascript
const TestWrapper = ({ children }) => (
  <AppProvider value={mockContextValue}>
    <BrowserRouter>{children}</BrowserRouter>
  </AppProvider>
);
```

## 📈 Continuous Integration

### GitHub Actions Workflow

```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:all
      - run: npm run build
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:coverage"
    }
  }
}
```

## 🔍 Debugging Tests

### Running Tests in Debug Mode

```bash
# Run specific test with verbose output
npm test -- --verbose --testNamePattern="Header Component"

# Run tests with coverage and watch
npm run test:coverage -- --watch

# Run tests in debug mode
node --inspect-brk node_modules/.bin/react-scripts test
```

### Test Debugging Tips

1. Use `console.log()` in tests to debug values
2. Use `screen.debug()` to see rendered output
3. Use `waitFor()` for async operations
4. Use `act()` for state updates

## 📝 Writing New Tests

### Component Test Template

```javascript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ComponentName from "../ComponentName";

const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("ComponentName", () => {
  test("renders correctly", () => {
    render(
      <TestWrapper>
        <ComponentName />
      </TestWrapper>
    );

    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

### API Test Template

```javascript
import { propertyAPI } from "../services/api";

describe("Property API", () => {
  test("getAllProperties returns properties", async () => {
    const properties = await propertyAPI.getAllProperties();
    expect(Array.isArray(properties)).toBe(true);
  });
});
```

## 🎯 Test Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Descriptive Test Names**: Make test names clear and specific
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
4. **Mock External Dependencies**: Don't test third-party libraries
5. **Test Edge Cases**: Include tests for error conditions and boundary values
6. **Keep Tests Independent**: Each test should be able to run in isolation
7. **Use Data Attributes**: Prefer `data-testid` over CSS selectors for testing

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Mock Service Worker](https://mswjs.io/) for API mocking

## 🚨 Known Issues

1. **Leaflet Icons**: Default markers may not display in tests
2. **Geolocation**: Location services need to be mocked
3. **File Uploads**: FormData testing requires special handling
4. **Time-dependent Tests**: Use `jest.useFakeTimers()` for time-based tests

## 📞 Support

For test-related issues or questions:

1. Check this documentation first
2. Review existing test examples
3. Check the test output for specific error messages
4. Ensure all dependencies are properly mocked

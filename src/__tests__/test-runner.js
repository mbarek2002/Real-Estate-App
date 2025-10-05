// Test runner script for comprehensive functionality testing
import { propertyAPI, authAPI, visitAPI, newsAPI } from "../services/api";

// Mock data for testing
const mockUser = {
  _id: "user123",
  fullName: "Test User",
  email: "test@example.com",
  phone: "123-456-7890",
  address: {
    address: "123 Test St",
    coordinates: [40.7128, -74.006],
  },
};

const mockProperty = {
  _id: "prop123",
  title: "Test Property",
  description: "A test property for testing",
  images: ["https://example.com/image1.jpg"],
  area: 120,
  bedrooms: 3,
  bathrooms: 2,
  forSale: true,
  salePrice: 500000,
  address: {
    address: "456 Property St",
    coordinates: [40.7589, -73.9851],
  },
  ownerId: "owner123",
};

const mockVisitRequest = {
  _id: "visit123",
  propertyId: "prop123",
  visitorId: "user123",
  ownerId: "owner123",
  visitDateTime: "2024-01-01T10:00:00Z",
  type: "sale",
  status: "Pending",
};

const mockNews = {
  _id: "news123",
  title: "Test News",
  content: "This is test news content",
  imageUrl: "https://example.com/news.jpg",
  createdAt: new Date(),
};

// Test categories
const testCategories = {
  authentication: "Authentication Tests",
  properties: "Property Management Tests",
  search: "Search and Filter Tests",
  visits: "Visit Request Tests",
  favorites: "Favorites Tests",
  news: "News Tests",
  integration: "Integration Tests",
};

// Test results storage
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: [],
};

// Utility functions
const logTest = (category, testName, status, message = "") => {
  const result = {
    category,
    testName,
    status,
    message,
    timestamp: new Date().toISOString(),
  };

  testResults.details.push(result);
  testResults.total++;

  if (status === "PASS") {
    testResults.passed++;
    console.log(`✅ ${category}: ${testName} - PASSED`);
  } else {
    testResults.failed++;
    console.log(`❌ ${category}: ${testName} - FAILED: ${message}`);
  }
};

const runAPITest = async (testName, apiCall, expectedResult) => {
  try {
    const result = await apiCall;
    if (JSON.stringify(result) === JSON.stringify(expectedResult)) {
      logTest("API", testName, "PASS");
    } else {
      logTest("API", testName, "FAIL", "Result does not match expected");
    }
  } catch (error) {
    logTest("API", testName, "FAIL", error.message);
  }
};

// Authentication Tests
const runAuthenticationTests = async () => {
  console.log("\n🔐 Running Authentication Tests...");

  try {
    // Test user registration
    await runAPITest(
      "User Registration",
      authAPI.register({
        fullName: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: "123-456-7890",
      }),
      { message: "User registered successfully" }
    );

    // Test user login
    await runAPITest(
      "User Login",
      authAPI.login({
        email: "test@example.com",
        password: "password123",
      }),
      { token: "mock-token", user: mockUser }
    );

    // Test get profile
    await runAPITest(
      "Get User Profile",
      authAPI.getProfile("test@example.com"),
      mockUser
    );
  } catch (error) {
    logTest("Authentication", "Authentication Tests", "FAIL", error.message);
  }
};

// Property Management Tests
const runPropertyTests = async () => {
  console.log("\n🏠 Running Property Management Tests...");

  try {
    // Test get all properties
    await runAPITest("Get All Properties", propertyAPI.getAllProperties(), [
      mockProperty,
    ]);

    // Test get property by ID
    await runAPITest(
      "Get Property by ID",
      propertyAPI.getPropertyById("prop123"),
      mockProperty
    );

    // Test discover properties
    await runAPITest(
      "Discover Properties",
      propertyAPI.discoverProperties(40.7128, -74.006),
      {
        nearby: [mockProperty],
        recommended: [],
      }
    );

    // Test record property view
    await runAPITest(
      "Record Property View",
      propertyAPI.recordPropertyView("prop123", "user123"),
      { message: "View recorded" }
    );
  } catch (error) {
    logTest("Properties", "Property Management Tests", "FAIL", error.message);
  }
};

// Search and Filter Tests
const runSearchTests = async () => {
  console.log("\n🔍 Running Search and Filter Tests...");

  try {
    // Test search with location
    const searchResult = await propertyAPI.discoverProperties(40.7128, -74.006);
    if (searchResult && searchResult.nearby) {
      logTest("Search", "Location-based Search", "PASS");
    } else {
      logTest(
        "Search",
        "Location-based Search",
        "FAIL",
        "No nearby properties returned"
      );
    }

    // Test search without location
    const allProperties = await propertyAPI.getAllProperties();
    if (Array.isArray(allProperties)) {
      logTest("Search", "Get All Properties", "PASS");
    } else {
      logTest("Search", "Get All Properties", "FAIL", "Result is not an array");
    }
  } catch (error) {
    logTest("Search", "Search Tests", "FAIL", error.message);
  }
};

// Visit Request Tests
const runVisitTests = async () => {
  console.log("\n📅 Running Visit Request Tests...");

  try {
    // Test create visit request
    await runAPITest(
      "Create Visit Request",
      visitAPI.requestVisit({
        propertyId: "prop123",
        visitorId: "user123",
        ownerId: "owner123",
        visitDateTime: "2024-01-01T10:00:00Z",
        type: "sale",
      }),
      mockVisitRequest
    );

    // Test get sent visits
    await runAPITest("Get Sent Visits", visitAPI.getSentVisits("user123"), [
      mockVisitRequest,
    ]);

    // Test get received visits
    await runAPITest(
      "Get Received Visits",
      visitAPI.getReceivedVisits("owner123"),
      [mockVisitRequest]
    );

    // Test update visit status
    await runAPITest(
      "Update Visit Status",
      visitAPI.updateVisitStatus("visit123", "Approved", "Approved for visit"),
      { message: "Visit request updated" }
    );
  } catch (error) {
    logTest("Visits", "Visit Request Tests", "FAIL", error.message);
  }
};

// News Tests
const runNewsTests = async () => {
  console.log("\n📰 Running News Tests...");

  try {
    // Test get all news
    await runAPITest("Get All News", newsAPI.getAllNews(), [mockNews]);

    // Test get news by ID
    await runAPITest(
      "Get News by ID",
      newsAPI.getNewsById("news123"),
      mockNews
    );
  } catch (error) {
    logTest("News", "News Tests", "FAIL", error.message);
  }
};

// Integration Tests
const runIntegrationTests = async () => {
  console.log("\n🔗 Running Integration Tests...");

  try {
    // Test complete user flow: register -> login -> search -> view property -> request visit
    console.log("Testing complete user flow...");

    // Step 1: User registration
    const registerResult = await authAPI.register({
      fullName: "Integration Test User",
      email: "integration@example.com",
      password: "password123",
      phone: "123-456-7890",
    });

    if (registerResult) {
      logTest("Integration", "User Registration Flow", "PASS");
    } else {
      logTest(
        "Integration",
        "User Registration Flow",
        "FAIL",
        "Registration failed"
      );
    }

    // Step 2: User login
    const loginResult = await authAPI.login({
      email: "integration@example.com",
      password: "password123",
    });

    if (loginResult && loginResult.token) {
      logTest("Integration", "User Login Flow", "PASS");
    } else {
      logTest("Integration", "User Login Flow", "FAIL", "Login failed");
    }

    // Step 3: Search properties
    const searchResult = await propertyAPI.discoverProperties(40.7128, -74.006);

    if (searchResult && (searchResult.nearby || searchResult.recommended)) {
      logTest("Integration", "Property Search Flow", "PASS");
    } else {
      logTest("Integration", "Property Search Flow", "FAIL", "Search failed");
    }

    // Step 4: View property details
    const propertyResult = await propertyAPI.getPropertyById("prop123");

    if (propertyResult && propertyResult._id) {
      logTest("Integration", "Property Details Flow", "PASS");
    } else {
      logTest(
        "Integration",
        "Property Details Flow",
        "FAIL",
        "Property details failed"
      );
    }

    // Step 5: Request visit
    const visitResult = await visitAPI.requestVisit({
      propertyId: "prop123",
      visitorId: "user123",
      ownerId: "owner123",
      visitDateTime: "2024-01-01T10:00:00Z",
      type: "sale",
    });

    if (visitResult && visitResult._id) {
      logTest("Integration", "Visit Request Flow", "PASS");
    } else {
      logTest(
        "Integration",
        "Visit Request Flow",
        "FAIL",
        "Visit request failed"
      );
    }
  } catch (error) {
    logTest("Integration", "Integration Tests", "FAIL", error.message);
  }
};

// Main test runner
const runAllTests = async () => {
  console.log("🚀 Starting Comprehensive Functionality Tests...\n");

  // Reset test results
  testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: [],
  };

  try {
    await runAuthenticationTests();
    await runPropertyTests();
    await runSearchTests();
    await runVisitTests();
    await runNewsTests();
    await runIntegrationTests();

    // Print summary
    console.log("\n📊 Test Summary:");
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(
      `Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(
        2
      )}%`
    );

    if (testResults.failed > 0) {
      console.log("\n❌ Failed Tests:");
      testResults.details
        .filter((test) => test.status === "FAIL")
        .forEach((test) => {
          console.log(`- ${test.category}: ${test.testName} - ${test.message}`);
        });
    }

    return testResults;
  } catch (error) {
    console.error("Test runner error:", error);
    return testResults;
  }
};

// Export for use in other files
export {
  runAllTests,
  runAuthenticationTests,
  runPropertyTests,
  runSearchTests,
  runVisitTests,
  runNewsTests,
  runIntegrationTests,
  testResults,
};

// Run tests if this file is executed directly
if (typeof window === "undefined") {
  runAllTests().then((results) => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

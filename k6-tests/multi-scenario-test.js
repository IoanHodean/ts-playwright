import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { SharedArray } from 'k6/data';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Test configuration
export const options = {
  scenarios: {
    // Scenario 1: API Health Check
    health_check: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
      tags: { scenario: 'health_check' },
    },
    // Scenario 2: Load Test Search API
    search_api: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
      ],
      tags: { scenario: 'search' },
    },
    // Scenario 3: Stress Test Create Operations
    create_operations: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 50,
      stages: [
        { duration: '1m', target: 10 },
        { duration: '30s', target: 20 },
        { duration: '30s', target: 0 },
      ],
      tags: { scenario: 'create' },
    },
  },
  thresholds: {
    'http_req_duration{scenario:health_check}': ['p(95)<200'],
    'http_req_duration{scenario:search}': ['p(95)<500'],
    'http_req_duration{scenario:create}': ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

// Test data
const users = new SharedArray('users', function() {
  return [
    { username: 'user1', email: 'user1@example.com' },
    { username: 'user2', email: 'user2@example.com' },
    { username: 'user3', email: 'user3@example.com' },
  ];
});

const searchTerms = ['phone', 'laptop', 'tablet', 'headphones'];
const BASE_URL = env.process.BASE_URL; // Replace with your API URL

export function setup() {
  // Perform any setup tasks, like authentication
  const loginRes = http.post(`${BASE_URL}/auth/token`, {
    username: 'testuser',
    password: 'testpass',
  });
  return { token: loginRes.json('token') };
}

export default function (data) {
  group('Health Check API', function () {
    const healthCheck = http.get(`${BASE_URL}/health`);
    check(healthCheck, {
      'health check is ok': (r) => r.status === 200,
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
  });

  sleep(1);

  group('Search API', function () {
    const searchTerm = randomItem(searchTerms);
    const searchResponse = http.get(`${BASE_URL}/search?q=${searchTerm}`);
    check(searchResponse, {
      'search returned 200': (r) => r.status === 200,
      'search results not empty': (r) => r.json('results').length > 0,
    });
  });

  sleep(1);

  group('Create Operations', function () {
    const user = randomItem(users);
    const payload = JSON.stringify({
      username: user.username,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    const createResponse = http.post(
      `${BASE_URL}/users`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`,
        },
      }
    );

    check(createResponse, {
      'create user successful': (r) => r.status === 201,
      'user data returned': (r) => r.json('id') !== undefined,
    });
  });

  sleep(2);
} 
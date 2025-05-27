import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
};

// Test setup
const BASE_URL = 'https://test.k6.io';

// Test scenarios
export default function () {
  // Scenario 1: Simple GET request
  const response = http.get(`${BASE_URL}/`);
  check(response, {
    'is status 200': (r) => r.status === 200,
    'has welcome message': (r) => r.body.includes('Welcome to k6'),
  });

  // Scenario 2: POST request with data
  const payload = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
  });

  const postResponse = http.post(`${BASE_URL}/contacts`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(postResponse, {
    'is status 200': (r) => r.status === 200,
    'has success message': (r) => r.body.includes('success'),
  });

  // Add a sleep between iterations to simulate real user behavior
  sleep(1);
} 
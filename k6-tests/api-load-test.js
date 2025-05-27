import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Test configuration
export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.01'],    // Less than 1% failure rate
  },
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Common headers
const headers = {
  'Content-Type': 'application/json',
};

// Test scenarios
export default function () {
  group('User CRUD Operations', function () {
    try {
      // GET list of users
      const listResponse = http.get(`${BASE_URL}/users`);
      check(listResponse, {
        'get users status is 200': (r) => r.status === 200,
        'get users has data': (r) => {
          const body = r.json();
          return Array.isArray(body) && body.length > 0;
        },
      });

      // GET single user
      const singleUserResponse = http.get(`${BASE_URL}/users/1`);
      check(singleUserResponse, {
        'get single user status is 200': (r) => r.status === 200,
        'user has expected fields': (r) => {
          const body = r.json();
          return body && 
                 body.id && 
                 body.name && 
                 body.email && 
                 body.address;
        },
      });

      // POST create user
      const createPayload = JSON.stringify({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        address: {
          street: 'Example St',
          suite: 'Apt 123',
          city: 'Testville',
          zipcode: '12345'
        }
      });
      const createResponse = http.post(`${BASE_URL}/users`, createPayload, { headers });
      check(createResponse, {
        'create user status is 201': (r) => r.status === 201,
        'create user returns data': (r) => {
          const body = r.json();
          return body && 
                 body.name === 'John Doe' && 
                 body.email === 'john@example.com';
        },
      });

      sleep(1);
    } catch (e) {
      console.error('Error in User CRUD Operations:', e);
    }
  });

  group('Posts Operations', function () {
    try {
      // GET user's posts
      const postsResponse = http.get(`${BASE_URL}/users/1/posts`);
      check(postsResponse, {
        'get posts status is 200': (r) => r.status === 200,
        'posts data is valid': (r) => {
          const body = r.json();
          return Array.isArray(body) && body.length > 0;
        },
      });

      // POST create post
      const postPayload = JSON.stringify({
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1
      });
      const createPostResponse = http.post(`${BASE_URL}/posts`, postPayload, { headers });
      check(createPostResponse, {
        'create post status is 201': (r) => r.status === 201,
        'create post returns data': (r) => {
          const body = r.json();
          return body && 
                 body.title === 'Test Post' && 
                 body.body === 'This is a test post';
        },
      });
    } catch (e) {
      console.error('Error in Posts Operations:', e);
    }
  });

  group('Update Operations', function () {
    try {
      // PUT update user
      const updatePayload = JSON.stringify({
        name: 'John Doe Updated',
        username: 'johndoeupdated',
        email: 'john.updated@example.com'
      });
      const putResponse = http.put(`${BASE_URL}/users/1`, updatePayload, { headers });
      check(putResponse, {
        'update user status is 200': (r) => r.status === 200,
        'update returns correct data': (r) => {
          const body = r.json();
          return body && 
                 body.name === 'John Doe Updated' && 
                 body.email === 'john.updated@example.com';
        },
      });

      // DELETE user
      const deleteResponse = http.del(`${BASE_URL}/users/1`);
      check(deleteResponse, {
        'delete user status is 200': (r) => r.status === 200,
      });
    } catch (e) {
      console.error('Error in Update Operations:', e);
    }
  });

  // Add think time between iterations
  sleep(Math.random() * 3 + 2); // Random sleep between 2-5 seconds
} 
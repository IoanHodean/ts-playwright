import http from 'k6/http';
import { check } from 'k6';

export default function () {
  // Simple GET request to check response format
  const response = http.get('https://reqres.in/api/users?page=2');
  console.log('Response status:', response.status);
  console.log('Response body:', response.body);
  
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
} 
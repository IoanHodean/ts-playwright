import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',
};

export default function () {
  const res = http.get('https://reqres.in/api/users/2');
  console.log(`Response status: ${res.status}`);
  console.log(`Response body: ${res.body}`);
  
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
} 
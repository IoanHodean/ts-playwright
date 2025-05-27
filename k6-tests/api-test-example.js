import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { SharedArray } from 'k6/data';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Test configuration
export const options = {
  scenarios: {
    // API Health Check
    health_check: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      tags: { scenario: 'health_check' },
    },
    // Products API Test
    products_api: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 5 },
        { duration: '30s', target: 5 },
        { duration: '10s', target: 0 },
      ],
      tags: { scenario: 'products' },
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% can fail
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api';

// Test data
const products = new SharedArray('products', function() {
  return [
    { name: 'Test Product 1', price: 29.99 },
    { name: 'Test Product 2', price: 49.99 },
    { name: 'Test Product 3', price: 99.99 },
  ];
});

export function setup() {
  // Get authentication token
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'testpass123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined,
  });

  return { token: loginRes.json('token') };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`,
  };

  group('Health Check', function () {
    const healthCheck = http.get(`${BASE_URL}/health`);
    check(healthCheck, {
      'status is up': (r) => r.status === 200,
      'system is healthy': (r) => r.json('status') === 'healthy',
    });
  });

  sleep(1);

  group('Products API', function () {
    // GET products
    const productsRes = http.get(`${BASE_URL}/products`, { headers });
    check(productsRes, {
      'get products success': (r) => r.status === 200,
      'has products': (r) => r.json('data').length > 0,
    });

    // POST new product
    const product = randomItem(products);
    const createRes = http.post(
      `${BASE_URL}/products`,
      JSON.stringify(product),
      { headers }
    );
    check(createRes, {
      'create product success': (r) => r.status === 201,
      'has product id': (r) => r.json('id') !== undefined,
    });

    if (createRes.status === 201) {
      const productId = createRes.json('id');
      
      // GET single product
      const getRes = http.get(
        `${BASE_URL}/products/${productId}`,
        { headers }
      );
      check(getRes, {
        'get product success': (r) => r.status === 200,
        'correct product': (r) => r.json('name') === product.name,
      });

      // PUT update product
      const updateRes = http.put(
        `${BASE_URL}/products/${productId}`,
        JSON.stringify({ ...product, price: product.price + 10 }),
        { headers }
      );
      check(updateRes, {
        'update product success': (r) => r.status === 200,
        'price updated': (r) => r.json('price') === product.price + 10,
      });

      // DELETE product
      const deleteRes = http.del(
        `${BASE_URL}/products/${productId}`,
        null,
        { headers }
      );
      check(deleteRes, {
        'delete product success': (r) => r.status === 204,
      });
    }
  });

  sleep(2);
} 
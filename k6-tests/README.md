# K6 Load Tests

This directory contains load tests for our API using k6.

## Setup

1. Install k6:
   ```bash
   # Windows (Chocolatey)
   choco install k6

   # macOS
   brew install k6

   # Linux
   sudo apt-get install k6
   ```

2. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

## Available Tests

1. **api-test-example.js**
   - Complete CRUD operations for products
   - Health check endpoint
   - Authentication flow
   ```bash
   k6 run -e BASE_URL=http://your-api.com api-test-example.js
   ```

2. **multi-scenario-test.js**
   - Multiple concurrent scenarios
   - Different load patterns
   - API health monitoring
   ```bash
   k6 run -e BASE_URL=http://your-api.com multi-scenario-test.js
   ```

## Running Tests

1. Basic run:
   ```bash
   k6 run <test-file>.js
   ```

2. With environment variables:
   ```bash
   k6 run -e BASE_URL=http://your-api.com -e USERNAME=user -e PASSWORD=pass <test-file>.js
   ```

3. With custom VUs and duration:
   ```bash
   k6 run --vus 10 --duration 30s <test-file>.js
   ```

4. Output results to JSON:
   ```bash
   k6 run --out json=results.json <test-file>.js
   ```

## Test Configuration

- Default thresholds:
  - 95% of requests must complete below 500ms
  - Less than 1% of requests can fail

- Virtual Users (VUs):
  - Health Check: 1 VU
  - API Tests: 5 VUs with ramping

## Scenarios

1. **Health Check**
   - Constant 1 VU
   - Monitors API health

2. **Products API**
   - Ramping VUs (0 to 5)
   - Tests CRUD operations
   - Includes authentication

## Best Practices

1. Always set appropriate thresholds
2. Use sleep() between requests
3. Include proper error handling
4. Group related requests
5. Use check() for assertions

## Troubleshooting

1. **Authentication Fails**
   - Check BASE_URL is correct
   - Verify credentials in .env
   - Ensure token format is correct

2. **High Error Rate**
   - Check API rate limits
   - Verify endpoint URLs
   - Review request payloads

3. **Performance Issues**
   - Adjust think time (sleep)
   - Reduce VUs or RPS
   - Check API capacity 
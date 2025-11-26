# Monitoring & Observability Guide

This document provides comprehensive information on setting up and using the monitoring and observability features of the CRM application.

## Table of Contents

1. [Prometheus Metrics](#prometheus-metrics)
2. [Grafana Dashboards](#grafana-dashboards)
3. [Sentry Error Tracking](#sentry-error-tracking)
4. [Health Check Endpoints](#health-check-endpoints)
5. [Rate Limiting](#rate-limiting)
6. [Production Setup](#production-setup)

---

## Prometheus Metrics

### Overview

Prometheus is an open-source monitoring and alerting system. The CRM application exposes metrics at `/metrics` for consumption by Prometheus.

### Available Metrics

#### HTTP Request Metrics

```
http_request_duration_seconds       # Histogram of request durations (labels: method, route, status_code)
http_requests_total                 # Counter of total HTTP requests
request_errors_total                # Counter of failed requests (4xx, 5xx)
```

**Labels:**

- `method` - HTTP method (GET, POST, PUT, DELETE, etc.)
- `route` - Request path
- `status_code` - HTTP response status code

#### Database Metrics

```
database_query_duration_seconds     # Histogram of database query durations
```

**Labels:**

- `operation` - Type of operation (e.g., 'user.findByPk', 'user.create')

#### Node.js Default Metrics

Automatically collected:

- `process_resident_memory_bytes` - Memory usage
- `process_cpu_seconds_total` - CPU time
- `nodejs_eventloop_lag_seconds` - Event loop lag
- `nodejs_gc_*` - Garbage collection metrics

### Accessing Metrics

**Direct HTTP Request:**

```bash
curl http://localhost:5000/metrics
```

**Output Format (Prometheus text format):**

```
# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",route="/api/auth/profile",status_code="200",le="0.1"} 5
http_request_duration_seconds_bucket{method="GET",route="/api/auth/profile",status_code="200",le="0.5"} 8
http_request_duration_seconds_bucket{method="GET",route="/api/auth/profile",status_code="200",le="+Inf"} 10
http_request_duration_seconds_sum{method="GET",route="/api/auth/profile",status_code="200"} 2.5
http_request_duration_seconds_count{method="GET",route="/api/auth/profile",status_code="200"} 10

# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="POST",route="/api/auth/login",status_code="200"} 42
```

### Custom Metrics in Code

To record custom metrics:

```javascript
import { recordDatabaseMetric, httpRequestDuration } from './utils/metrics.js';

// Record database query time
const startTime = Date.now();
const user = await User.findByPk(1);
const duration = Date.now() - startTime;
recordDatabaseMetric('user.findByPk', duration);

// Record histogram observation
httpRequestDuration.labels('GET', '/api/users', '200').observe(0.25);
```

---

## Grafana Dashboards

### Setup

1. **Start Monitoring Stack:**

```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

2. **Access Grafana:**

   - URL: http://localhost:3000
   - Default credentials: `admin` / `admin`

3. **Add Prometheus Data Source:**
   - Settings → Data Sources → Add data source
   - Choose Prometheus
   - URL: `http://prometheus:9090`
   - Save & Test

### Creating Dashboards

#### Example 1: Request Rate

**PromQL Query:**

```promql
rate(http_requests_total[5m])
```

Shows requests per second over the last 5 minutes.

#### Example 2: Error Rate

**PromQL Query:**

```promql
rate(request_errors_total[5m]) / rate(http_requests_total[5m])
```

Shows percentage of failed requests.

#### Example 3: Response Time (95th Percentile)

**PromQL Query:**

```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

Shows how long the 95th percentile of requests take.

#### Example 4: Database Query Performance

**PromQL Query:**

```promql
histogram_quantile(0.99, rate(database_query_duration_seconds_bucket[5m]))
```

Shows 99th percentile database query time.

#### Example 5: Memory Usage

**PromQL Query:**

```promql
process_resident_memory_bytes / 1024 / 1024
```

Shows memory usage in MB.

### Alerting Rules

Create file `prometheus-alerts.yml`:

```yaml
groups:
  - name: crm_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(request_errors_total[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        annotations:
          summary: 'High error rate detected'
          description: 'Error rate is above 5%'

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        annotations:
          summary: 'High request latency'
          description: '95th percentile latency exceeds 1 second'

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 500
        for: 5m
        annotations:
          summary: 'High memory usage'
          description: 'Memory usage exceeds 500MB'
```

---

## Sentry Error Tracking

### Setup

1. **Create Sentry Account:**

   - Go to https://sentry.io
   - Create new project (choose Node.js)
   - Copy your DSN

2. **Configure Environment:**

```env
# .env
SENTRY_DSN=https://your-key@sentry.io/your-project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

3. **Start Server:**
   - Errors are automatically captured and sent to Sentry

### Features

#### Error Grouping

Sentry automatically groups similar errors:

- Same error type and stack trace
- Group issues together for easier management

#### Performance Monitoring

```env
SENTRY_TRACES_SAMPLE_RATE=0.1  # Sample 10% of transactions
```

Tracks:

- Request duration
- Database queries
- External API calls

#### Breadcrumbs

Automatic breadcrumb tracking includes:

- HTTP requests
- Database queries
- Console logs
- User actions

#### Example: Manual Error Capture

```javascript
import * as Sentry from '@sentry/node';

try {
  // Some operation
  throw new Error('Something went wrong');
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      operation: 'user_login',
      userId: user.id,
    },
  });
}

// Set user context
Sentry.setUser({
  id: user.id,
  email: user.email,
});
```

### Release Tracking

Link errors to code releases:

```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: 'crm@1.0.0', // Version from package.json
});
```

This helps:

- Identify which version introduced a bug
- Compare errors between releases
- Mark errors as resolved

---

## Health Check Endpoints

### Endpoints

#### `/health` - Basic Status

```bash
curl http://localhost:5000/health
```

Response:

```json
{
  "success": true,
  "message": "Server is running",
  "environment": "development"
}
```

**Use case:** Simple liveness check, no dependencies checked

---

#### `/live` - Liveness Probe

```bash
curl http://localhost:5000/live
```

Response:

```json
{
  "success": true,
  "message": "Server is alive",
  "timestamp": "2025-11-26T10:30:45.123Z"
}
```

**Use case:** Docker/Kubernetes liveness probe. Always succeeds if server process is running.

---

#### `/ready` - Readiness Probe

```bash
curl http://localhost:5000/ready
```

Success Response (HTTP 200):

```json
{
  "success": true,
  "message": "Server is ready",
  "database": "connected",
  "timestamp": "2025-11-26T10:30:45.123Z"
}
```

Failure Response (HTTP 503):

```json
{
  "success": false,
  "message": "Server not ready",
  "database": "disconnected",
  "error": "Connection refused"
}
```

**Use case:** Docker/Kubernetes readiness probe. Only succeeds when database is accessible.

### Docker/Kubernetes Integration

**Dockerfile healthcheck:**

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/ready || exit 1
```

**Kubernetes liveness probe:**

```yaml
livenessProbe:
  httpGet:
    path: /live
    port: 5000
  initialDelaySeconds: 10
  periodSeconds: 10
```

**Kubernetes readiness probe:**

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 5
```

---

## Rate Limiting

### Configuration

Rate limiting is configured per environment in `middleware/rateLimiter.js`:

**Development:**

- General API: 1000 requests / 15 minutes
- Auth endpoints: 30 attempts / 15 minutes
- Sensitive operations: 10 requests / 15 minutes

**Production:**

- General API: 100 requests / 15 minutes
- Auth endpoints: 5 attempts / 15 minutes
- Sensitive operations: 2 requests / 15 minutes

### Rate Limit Headers

Responses include rate limit information:

```
RateLimit-Limit: 100
RateLimit-Remaining: 75
RateLimit-Reset: 1700000000
```

### Monitoring Rate Limits

```promql
# Requests near rate limit
(http_requests_total - rate(http_requests_total[5m]) * 300) / http_requests_total > 0.9
```

---

## Production Setup

### Complete Monitoring Stack

```bash
# Start API server
docker-compose -f docker-compose.prod.yml up -d

# Start monitoring (separate compose file)
docker-compose -f docker-compose.monitoring.yml up -d
```

### Environment Variables

```env
# Sentry
SENTRY_DSN=https://your-production-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1

# Server
PORT=5000
NODE_ENV=production

# Database
DB_HOST=prod-db.example.com
DB_USER=prod_user
DB_PASSWORD=***secure-password***
DB_NAME=crm_production
```

### Monitoring Architecture

```
┌─────────────────────┐
│   CRM API Server    │
│   (port 5000)       │
│   /metrics endpoint │
└──────────┬──────────┘
           │
           │ scrapes
           ▼
┌─────────────────────┐
│   Prometheus        │
│   (port 9090)       │
└──────────┬──────────┘
           │
           │ visualizes
           ▼
┌─────────────────────┐
│   Grafana           │
│   (port 3000)       │
└─────────────────────┘
           │
           │ (optional) alert to
           ▼
┌─────────────────────┐
│   Alerting System   │
│   (PagerDuty, etc)  │
└─────────────────────┘

Errors → Sentry (Central Error Tracking)
```

### Best Practices

1. **Monitor Error Rates**

   - Alert when error rate > 5%
   - Investigate root causes immediately

2. **Track Latency**

   - Monitor 95th percentile response time
   - Alert when > 1 second (adjust per SLA)

3. **Database Performance**

   - Monitor query durations
   - Alert on slow queries > 5 seconds

4. **Resource Usage**

   - Monitor memory and CPU
   - Set limits and auto-scaling rules

5. **Rate Limiting**

   - Monitor rate-limited requests
   - Adjust limits based on traffic patterns

6. **Security**
   - Log all authentication failures
   - Alert on repeated failed logins (brute force)
   - Monitor for unusual patterns

---

## Troubleshooting

### Prometheus Can't Connect to Metrics

1. Check if API is running: `curl http://localhost:5000/health`
2. Verify metrics endpoint: `curl http://localhost:5000/metrics`
3. Check Docker network: `docker network ls`
4. Update `prometheus.yml` target

### Grafana Datasource Error

1. Ensure Prometheus container is running: `docker ps`
2. Check network connectivity: `docker exec grafana ping prometheus`
3. Verify datasource URL in Grafana settings

### Sentry Errors Not Appearing

1. Verify `SENTRY_DSN` is set correctly
2. Check browser console for JavaScript errors
3. Verify project DSN in Sentry dashboard
4. Ensure environment variable is loaded: `echo $SENTRY_DSN`

### High Memory Usage

1. Check Node.js garbage collection: `node --max-old-space-size=4096 server.js`
2. Identify memory leaks using Sentry profiles
3. Monitor with: `curl http://localhost:5000/metrics | grep process_resident`

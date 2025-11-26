import * as prometheus from 'prom-client';

// Create a Registry
const register = new prometheus.Registry();

// Add default metrics (Node.js process metrics)
prometheus.collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const requestErrorsTotal = new prometheus.Counter({
  name: 'request_errors_total',
  help: 'Total number of request errors',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const databaseQueryDuration = new prometheus.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation'],
  registers: [register],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
});

/**
 * Middleware to record HTTP request metrics
 */
export const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const route = req.route?.path || req.path || 'unknown';

  // Record response when sent
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    const method = req.method;
    const statusCode = res.statusCode;

    // Record metrics
    httpRequestDuration.labels(method, route, statusCode).observe(duration);
    httpRequestsTotal.labels(method, route, statusCode).inc();

    if (statusCode >= 400) {
      requestErrorsTotal.labels(method, route, statusCode).inc();
    }
  });

  next();
};

/**
 * Helper function to record database query metrics
 */
export const recordDatabaseMetric = (operation, duration) => {
  databaseQueryDuration.labels(operation).observe(duration / 1000); // Convert to seconds
};

export { register };

import * as prometheus from 'prom-client';

// Create a Prometheus registry
export const register = prometheus.register;

// Middleware to collect metrics
export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = req.method;
    const path = req.route?.path || req.path || 'unknown';
    const status = res.statusCode;

    // Record metrics (optional: can add custom metrics here)
    // Example: httpRequestDuration.observe({ method, path, status }, duration / 1000);
  });

  next();
};

// Optional: Define custom metrics for tracking
// export const httpRequestDuration = new prometheus.Histogram({
//   name: 'http_request_duration_seconds',
//   help: 'Duration of HTTP requests in seconds',
//   labelNames: ['method', 'path', 'status'],
//   buckets: [0.1, 0.5, 1, 2, 5],
// });

export default { metricsMiddleware, register };

# Kubernetes Deployment Guide for Ameyo CRM

## Overview

This directory contains Kubernetes manifests for deploying the Ameyo CRM application in production environments.

## Files Structure

- **deployment.yaml** - Complete deployment manifests including:

  - Namespace: `ameyo-crm`
  - ConfigMap: Application configuration
  - Secret: Sensitive data (DB credentials, JWT secret)
  - StatefulSet: MSSQL database
  - Deployment: Application deployment (3 replicas)
  - Service: Kubernetes services
  - HorizontalPodAutoscaler: Auto-scaling configuration
  - Ingress: External traffic routing

- **monitoring.yaml** - Prometheus monitoring rules and ServiceMonitor
- **monitoring-stack.yaml** - Complete Prometheus and monitoring infrastructure

## Prerequisites

1. **Kubernetes Cluster** (1.20+)

   ```bash
   kubectl version --client
   ```

2. **Docker Image Built and Pushed**

   ```bash
   docker build -f docker/Dockerfile.prod -t your-registry/ameyo-crm:latest .
   docker push your-registry/ameyo-crm:latest
   ```

3. **kubectl CLI** installed and configured

   ```bash
   kubectl config current-context
   ```

4. **(Optional) Ingress Controller** if using ingress (nginx-ingress, etc.)

## Quick Start

### 1. Deploy Namespace and Application

```bash
# Deploy all resources
kubectl apply -f k8s/deployment.yaml

# Verify deployment
kubectl get pods -n ameyo-crm
kubectl get svc -n ameyo-crm
```

### 2. Check Deployment Status

```bash
# Watch deployment progress
kubectl rollout status deployment/ameyo-app -n ameyo-crm

# Check pod logs
kubectl logs -f deployment/ameyo-app -n ameyo-crm

# Describe deployment for issues
kubectl describe deployment ameyo-app -n ameyo-crm
```

### 3. Update Secrets Before Production

⚠️ **IMPORTANT**: Update sensitive data in deployment.yaml before deployment:

```bash
# Edit secrets
kubectl edit secret ameyo-app-secrets -n ameyo-crm
```

Or update before deployment:

```bash
# Create secret file
cat > secrets.env << EOF
DB_USER=sa
DB_PASSWORD=your-strong-password-here
JWT_SECRET=your-jwt-secret-here
SENTRY_DSN=your-sentry-dsn-optional
EOF

# Create secret from file
kubectl create secret generic ameyo-app-secrets \
  --from-env-file=secrets.env \
  -n ameyo-crm
```

## Configuration

### Environment Variables

All environment variables are managed through ConfigMap and Secrets:

**ConfigMap (Non-sensitive):**

- `NODE_ENV`: production
- `PORT`: 5000
- `DB_HOST`: ameyo-mssql
- `DB_PORT`: 1433
- `DB_NAME`: AmeyoDB
- `LOG_LEVEL`: info

**Secret (Sensitive):**

- `DB_USER`: sa
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing key
- `SENTRY_DSN`: Optional error tracking

### Database Connection

Database is deployed as StatefulSet with persistent storage:

- **Service Name**: ameyo-mssql
- **Port**: 1433
- **Storage**: 10Gi persistent volume
- **Replicas**: 1 (for MSSQL in K8s, keep at 1)

## Scaling

### Horizontal Pod Autoscaling (HPA)

The deployment includes HPA configuration that automatically scales the application:

```bash
# View HPA status
kubectl get hpa -n ameyo-crm

# Manual scaling (if needed)
kubectl scale deployment ameyo-app --replicas=5 -n ameyo-crm
```

**Scaling Triggers:**

- CPU Utilization > 70% (scale up)
- Memory Utilization > 80% (scale up)
- Scale down after 5 minutes of low usage
- Min replicas: 3, Max replicas: 10

## Health Checks

Both liveness and readiness probes are configured:

**Liveness Probe:** `/live` endpoint (restarts container if fails)

- Initial delay: 30s
- Period: 10s
- Timeout: 5s
- Failure threshold: 3

**Readiness Probe:** `/ready` endpoint (removes from load balancer if fails)

- Initial delay: 10s
- Period: 5s
- Timeout: 3s
- Failure threshold: 3

Add these endpoints to your application:

```javascript
// In server.js or routes
app.get('/live', (req, res) => res.status(200).send('OK'));
app.get('/ready', (req, res) => {
  // Check DB connection
  if (isDBConnected) {
    res.status(200).send('Ready');
  } else {
    res.status(503).send('Not Ready');
  }
});
```

## Monitoring

### Deploy Monitoring Stack

```bash
# Deploy Prometheus and monitoring rules
kubectl apply -f k8s/monitoring-stack.yaml

# Access Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Open http://localhost:9090
```

### Available Metrics

- Request rates and response times
- Error rates and exception counts
- Pod CPU and memory usage
- Database connection pool status
- Application startup time

## Ingress and External Access

### Option 1: Port Forward (Development)

```bash
kubectl port-forward -n ameyo-crm svc/ameyo-app 8080:80
# Access at http://localhost:8080
```

### Option 2: LoadBalancer Service (Cloud)

The service is configured as LoadBalancer type:

```bash
kubectl get svc ameyo-app -n ameyo-crm

# Get external IP
kubectl get service ameyo-app -n ameyo-crm --watch
```

### Option 3: Ingress (Recommended for Production)

Update ingress in deployment.yaml with your domain:

```yaml
host: your-domain.com
```

Then install ingress controller:

```bash
# For nginx-ingress
helm install nginx-ingress ingress-nginx/ingress-nginx

# Apply ingress
kubectl apply -f k8s/deployment.yaml
```

## Troubleshooting

### Pod is not starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n ameyo-crm

# View logs
kubectl logs <pod-name> -n ameyo-crm
kubectl logs <pod-name> -n ameyo-crm --previous  # Previous crash logs
```

### Database connection issues

```bash
# Verify database pod
kubectl get pods -n ameyo-crm -l app=ameyo-mssql
kubectl logs ameyo-mssql-0 -n ameyo-crm

# Test connection from app pod
kubectl exec -it deployment/ameyo-app -n ameyo-crm -- \
  /bin/bash -c "curl http://ameyo-mssql:1433"
```

### Readiness probe failing

```bash
# Check readiness probe endpoint
kubectl exec -it deployment/ameyo-app -n ameyo-crm -- \
  curl http://localhost:5000/ready

# View probe logs
kubectl describe pod <pod-name> -n ameyo-crm | grep -A 10 "Readiness"
```

## Updating Application

### Update Image

```bash
# Build and push new image
docker build -f docker/Dockerfile.prod -t your-registry/ameyo-crm:v1.1.0 .
docker push your-registry/ameyo-crm:v1.1.0

# Update deployment
kubectl set image deployment/ameyo-app \
  app=your-registry/ameyo-crm:v1.1.0 \
  -n ameyo-crm

# Monitor rollout
kubectl rollout status deployment/ameyo-app -n ameyo-crm
```

### Rollback if Issues

```bash
kubectl rollout undo deployment/ameyo-app -n ameyo-crm
kubectl rollout history deployment/ameyo-app -n ameyo-crm
```

## Database Backup

```bash
# Backup MSSQL database
kubectl exec -it ameyo-mssql-0 -n ameyo-crm -- \
  /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD \
  -Q "BACKUP DATABASE AmeyoDB TO DISK='/var/opt/mssql/backup/db.bak'"
```

## Resource Limits

Current resource allocation:

**App Pod:**

- CPU Request: 100m, Limit: 500m
- Memory Request: 256Mi, Limit: 512Mi

**Database (MSSQL):**

- CPU Request: 250m, Limit: 1000m
- Memory Request: 512Mi, Limit: 2Gi

Adjust based on your usage patterns and cluster capacity.

## Security Best Practices

1. ✅ Secrets stored separately from ConfigMap
2. ✅ RBAC configured for monitoring
3. ✅ Network policies can be added for pod-to-pod communication
4. ✅ Pod security policies recommended
5. ✅ TLS/SSL via Ingress (configured but commented)
6. ✅ Resource limits defined

Add NetworkPolicy for pod isolation:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ameyo-netpolicy
spec:
  podSelector:
    matchLabels:
      app: ameyo-app
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: ameyo-app
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: ameyo-mssql
```

## Cleanup

```bash
# Delete all resources in namespace
kubectl delete namespace ameyo-crm

# Or delete specific resources
kubectl delete -f k8s/deployment.yaml
kubectl delete -f k8s/monitoring-stack.yaml
```

## Support & Documentation

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [MSSQL on Kubernetes](https://learn.microsoft.com/en-us/sql/linux/quickstart-sql-server-containers-kubernetes)
- [Prometheus Operator](https://prometheus-operator.dev/)
- [Ingress NGINX](https://kubernetes.github.io/ingress-nginx/)

## Key Deployment Targets

- **Development**: docker-compose (see docker-compose.yml)
- **Staging**: Docker Compose with monitoring (see docker-compose.prod.yml)
- **Production**: Kubernetes (see k8s/ manifests)

---

**Last Updated**: 2024
**Maintained By**: DevOps Team

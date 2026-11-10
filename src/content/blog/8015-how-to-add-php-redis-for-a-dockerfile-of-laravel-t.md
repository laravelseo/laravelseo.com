---
title: "How to add php-redis for a dockerfile of laravel to kubernetes?"
description: "How to Integrate Redis into Your Laravel Docker Deployment on Kubernetes Deploying a Laravel application, especially one utilizing caching or session..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

Deploying a Laravel application, especially one utilizing caching or session management, often necessitates an external data store like Redis for performance and scalability. When you are containerizing your application using Docker and orchestrating it with Kubernetes, integrating services like Redis requires careful consideration of networking, service discovery, and image layering.

As a senior developer, I can tell you that the goal is not to install Redis *inside* your PHP-FPM container, but rather to run Redis as a separate, dedicated service within your Kubernetes cluster and ensure your application container can securely communicate with it. This approach adheres to the principles of microservices and containerization best practices.

Here is a comprehensive guide on how to achieve this integration for your Laravel setup.

---

## The Containerized Approach: Decoupling Services

The core principle here is decoupling. Your PHP-FPM container should focus solely on running the application code, while Redis should exist as an independent service. This makes scaling, updating, and managing each component much cleaner.

### Step 1: Define the Redis Service in Kubernetes

First, you must define a Deployment and a Service for your Redis instance within your Kubernetes YAML files. This ensures that Redis has a stable internal DNS name that other pods can use to connect.

**Example `redis-deployment.yaml` snippet:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis-server
        image: redis:latest
        ports:
        - containerPort: 6379
```

**Example `redis-service.yaml` snippet:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  selector:
    app: redis
  ports:
    - protocol: TCP
      port: 6379
      targetPort: 6379
```

Once deployed, Kubernetes will assign an internal DNS name (e.g., `redis-service`) to this Redis instance, making it reachable by any other pod in the cluster.

### Step 2: Configuring PHP to Connect to Redis

Your existing PHP Dockerfile sets up your application environment. To use Redis, you need to ensure two things:
1. The necessary PHP extension is installed (if using native communication).
2. The application code knows how to connect to the external service.

Since you are working with a Laravel setup, typically you configure this connection within your `.env` file or configuration files, pointing to the Kubernetes Service name rather than a hardcoded IP address.

**Modifying the PHP Dockerfile (Focus on Dependencies):**

While you don't need Redis *inside* the PHP image for simple client connections, installing the necessary extension is often beneficial if you plan heavy interaction. For standard Laravel caching/session drivers, simply ensuring the `php-redis` extension is available or relying on a robust PHP client library connection string is sufficient.

If you choose to rely on the official Redis client libraries (which is very common in modern PHP deployments), make sure your application code uses environment variables for configuration:

```php
// In your Laravel application code or service configuration
$redis_host = env('REDIS_HOST', 'redis-service'); // Use the Kubernetes Service name
$redis_port = env('REDIS_PORT', 6379);

// Connect using these variables
$redis = new Redis();
$redis->connect($redis_host, $redis_port);
```

This pattern ensures that your application is portable. As noted in the Laravel documentation regarding services and configuration management, externalizing configuration makes deployments significantly more robust.

### Step 3: Reviewing Your Existing Docker Setup (Nginx/PHP-FPM)

Your existing Nginx and PHP-FPM files are well-structured for proxying requests (`fastcgi_pass php:9000;`). The key is that the `php` container (which hosts your application code) must be able to resolve `redis-service`. In a standard Kubernetes setup, this internal DNS resolution handles the connection seamlessly across the Pod network.

### Conclusion

Integrating Redis into a Laravel deployment on Kubernetes is fundamentally about establishing reliable network communication between decoupled services. By treating Redis as an external dependency managed by Kubernetes Services, you achieve true separation of concerns. Your PHP application container simply needs to be configured to connect to the service name provided by Kubernetes, making your entire CI/CD pipeline cleaner and more scalable. This architectural approach mirrors the robust design principles promoted by the Laravel ecosystem, ensuring that your backend services are resilient and easily managed.

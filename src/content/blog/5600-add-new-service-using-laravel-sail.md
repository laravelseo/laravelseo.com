---
title: "Add new service using laravel sail"
description: "Extending Your Laravel Environment: Adding Redis to Docker with Laravel Sail As a developer working with modern PHP stacks, embracing containerization..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As a developer working with modern PHP stacks, embracing containerization through Docker has become an indispensable skill. Laravel Sail significantly simplifies this process by abstracting away the complexities of Docker Compose, allowing developers to focus on application logic rather than infrastructure setup. If you've successfully set up your Laravel project and are now looking to expand its capabilities—for instance, adding a caching layer like Redis—you might wonder how to seamlessly integrate new services into your existing Sail environment.

This guide will walk you through the practical steps of adding a Redis service to your existing Laravel Sail setup, demystifying the underlying Docker concepts along the way.

## Understanding the Sail Mechanism

Laravel Sail works by reading and utilizing a pre-configured `docker-compose.yml` file. When you run `sail up`, Sail orchestrates the creation of all necessary services (like MySQL, PHP-FPM, etc.) defined in that file. To add a new service like Redis, we don't need to rewrite the entire setup; we simply need to instruct Docker Compose to include the new Redis service definition.

The key to adding services is editing the `docker-compose.yml` file that Sail generates. This file acts as the blueprint for your entire application environment.

## Step-by-Step Guide to Adding Redis

Since you are using Laravel Sail, the most efficient way to introduce a new dependency is by modifying the configuration file directly within the project root.

### 1. Locate and Edit `docker-compose.yml`

Navigate to the root directory of your Laravel project. You will find the primary configuration file here. Open the `docker-compose.yml` file. Notice how it currently defines the existing services (like `mysql`, `pgsql`, etc.).

You need to add a new service block specifically for Redis, defining the image you want to use and any necessary configurations.

### 2. Define the Redis Service

Add the following configuration snippet to your `docker-compose.yml` file. This defines the Redis container:

```yaml
version: '3.8'
services:
    # Existing services...
    mysql:
        # ... existing mysql configuration
        image: mysql:8.0
        # ... other settings

    redis:
        image: redis:alpine  # Using a lightweight Alpine image for Redis
        container_name: laravel_redis
        restart: always
        ports:
            - "6379:6379"
        volumes:
            - redis_data:/data
        networks:
            - laravel_network

    # ... other services
    
    volumes:
        redis_data:
```

**Explanation of the addition:**
*   **`image: redis:alpine`**: We select a lightweight, official Redis image. Alpine is preferred for smaller container sizes.
*   **`container_name`**: Assigning a clear name helps in managing the container later.
*   **`ports`**: Mapping port 6379 ensures that Redis is accessible from your host machine if needed, though internal communication within the Docker network is usually sufficient for Laravel applications.
*   **`volumes`**: Defining a named volume (`redis_data`) ensures that any data persisted in the Redis container survives container restarts.

### 3. Rebuild and Restart the Environment

Once you have saved the updated `docker-compose.yml`, navigate back to your terminal and execute the standard Sail command to apply the changes:

```bash
./vendor/bin/sail down
./vendor/bin/sail up -d
```

The `down` command stops and removes the old containers, and the `up -d` command reads the newly modified configuration file, pulls the Redis image, creates the new Redis container, and connects it to your existing network. Your Laravel application will now be able to connect to the Redis service defined within the Docker network.

## Conclusion: The Power of Container Orchestration

Adding services like Redis demonstrates the true power of container orchestration tools like Docker Compose. It allows you to define complex multi-service applications as easily as defining a single process. As we explore more advanced development patterns, remember that leveraging these tools effectively is crucial for maintaining scalable and reproducible environments, much like how robust platforms such as those offered by [laravelcompany.com](https://laravelcompany.com) provide the foundational structure for modern application deployment. By mastering this Docker-Sail workflow, you gain the confidence to build feature-rich applications faster and more reliably.

---
title: "Docker + Laravel queue:work"
description: "Mastering Asynchronous Processing: Running Laravel Queues Effectively in Docker As a senior developer working with modern PHP frameworks like Laravel, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with modern PHP frameworks like Laravel, we often encounter the challenge of managing background processes—specifically queue workers—within containerized environments. When you try to combine a long-running worker process with a standard web server inside a single Docker container, you quickly run into complex issues related to process lifecycle management and container health.

This post dives into the common pitfalls developers face when trying to execute commands like `php artisan queue:work` directly within a Docker setup and presents the robust, scalable solution.

## The Problem with Running Workers in the Main Container

Many developers attempt to run long-running commands directly using `CMD` or `ENTRYPOINT`. For example, trying to use:

```dockerfile
CMD ["php", "artisan", "queue:work", "-n", "-q"]
```

While this successfully starts the queue worker, it immediately causes a problem in a typical Docker setup. The container's lifecycle is tied to the main process. If the `queue:work` command finishes (or if the shell environment exits), the container sees that its primary process has terminated and stops running, even if background processes are technically still alive inside it. This breaks the entire application stack, as your web server or other services relying on that container will fail immediately.

The attempts to use shell backgrounding (`&`) combined with keeping the container alive (e.g., `tail -f /dev/null`) demonstrate an attempt to hack a solution. While this might keep the process running momentarily, it is not a reliable, portable, or Docker-native way to manage services. It conflates the responsibilities of the application server and the background worker into one fragile unit.

## The Docker Best Practice: Separation of Concerns

The fundamental principle we must adhere to in containerization is **Separation of Concerns**. A single container should ideally run one specific, well-defined service. For a Laravel application that utilizes queues, this means separating the concerns:

1.  **Web Server Container:** Responsible for handling HTTP requests (e.g., Nginx or PHP-FPM).
2.  **Worker Container:** Responsible solely for processing queue jobs asynchronously.

This separation makes scaling, debugging, and deploying significantly easier. If your queue needs more memory or CPU than your web server, you can scale the worker independently without affecting the web front end. This architectural approach aligns perfectly with building robust systems, much like the principles discussed when architecting services on platforms like [Laravel Company](https://laravelcompany.com).

## The Solution: Using Docker Compose for Multi-Service Orchestration

The correct way to manage these interconnected services is by leveraging **Docker Compose**. Instead of trying to force a single container to do two jobs, we define separate services in our `docker-compose.yml` file, each with its own defined image and command.

Here is how you structure the setup:

### 1. Define the Web Service

This service handles your web requests (e.g., serving Laravel routes).

```yaml
# docker-compose.yml snippet for the web server
services:
  app:
    build: .
    command: php artisan serve # Or whatever command starts your web process
    volumes:
      - .:/var/www/html
```

### 2. Define the Worker Service

This service runs only the queue worker, isolated from the web application environment.

```yaml
# docker-compose.yml snippet for the worker
services:
  worker:
    build: .
    # This command runs the queue worker indefinitely and cleanly
    command: php artisan queue:work --sleep=3 --tries=3
    depends_on:
      - app # Ensure the application container is up first
```

When you run `docker compose up`, Docker Compose spins up two entirely separate, independent containers. The `worker` container starts its process (`php artisan queue:work`) and runs until it completes its work (or is manually stopped), while the `app` container remains ready to serve requests. This provides stability and predictability that backgrounding a single command never could.

## Conclusion

Trying to shoehorn long-running daemon processes like Laravel queue workers into a single container command is an anti-pattern in Docker. It leads to brittle deployments and poor scalability. The professional solution, whether you are using Docker or any modern orchestration tool, is to adopt the principle of service separation. By defining distinct services for your web application and your background workers via Docker Compose, you ensure that each component performs its designated task efficiently, resulting in a more robust, scalable, and maintainable Laravel application.

---
title: "How to run queue work on Laravel with docker?"
description: "How to Run Queue Work on Laravel with Docker: Solving the php artisan queue:work Error As a senior developer working with modern PHP frameworks like..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As a senior developer working with modern PHP frameworks like Laravel, containerization with Docker has become an indispensable tool for deploying and scaling applications. When we move beyond local development and into production environments, managing background processes—especially asynchronous queue workers—within a Docker setup requires careful configuration.

Today, we are diving into a very common hurdle: running long-running commands like `php artisan queue:work` inside a `docker-compose` environment and encountering cryptic errors like `failed switching to "php": unable to find user php`. This post will diagnose why this happens and provide the robust solution for reliably executing your Laravel queue jobs within Docker.

## The Problem: Why Docker Fails with Queue Workers

You have correctly set up your services in `docker-compose.yml` to include a dedicated service for running the queue worker:

```yaml
    php-queue:
        restart: always
        image: sail-8.0/app:latest
        command: 'php artisan queue:work' # This command fails upon execution
        volumes:
            - '.:/var/www/html'
```

When you run `docker-compose up`, the error `error: failed switching to "php": unable to find user php: no matching entries in passwd file` indicates a fundamental issue with how the container is attempting to execute the command. This usually stems from one of two places:

1.  **User Context Mismatch:** The base Docker image or the way Sail sets up permissions inside the container does not recognize the expected user context for running PHP commands directly via `command`.
2.  **Entrypoint/CMD Conflict:** When you specify a bare command, Docker tries to execute it as the default user, and if that user setup within the container is incomplete (missing standard Linux users or proper `/etc/passwd` entries), the switch fails.

This issue is often more pronounced when dealing with specialized images like those provided by Laravel Sail, which manage complex user setups for web servers and application processes.

## The Solution: A Robust Docker Queue Strategy

The most reliable way to handle long-running background tasks in Docker is not just defining a service with a command, but ensuring the container environment is correctly initialized and that the process has the necessary permissions to run indefinitely.

Instead of relying solely on the `command:` directive inside the service definition for complex processes, we should leverage the established structure provided by Laravel Sail and ensure the worker runs as a proper background process managed by Docker.

### Step 1: Verify Base Image Integrity (Sail Best Practice)

Ensure that your setup adheres to the principles outlined in the official documentation, such as those found on the [Laravel documentation](https://laravelcompany.com/docs). Laravel Sail is designed to manage these dependencies smoothly. If you are using the standard Sail setup, the issue might be an environment variable or volume conflict rather than a flaw in the command itself.

### Step 2: Use an Entrypoint for Stability

For services that need to run continuously, it is often better practice to define an explicit `ENTRYPOINT` or use a script wrapper instead of just a simple `command`. This ensures the container starts correctly before executing your application logic.

A more stable approach involves defining the worker process as a dedicated service within the workflow, ensuring that when you run `docker-compose up`, all dependencies (database, Redis, application server) are initialized first.

### Step 3: The Recommended Docker Compose Structure

For queue workers, we often treat them separately from the main application container and ensure they have persistent access to the code and environment settings.

Here is an improved structure focusing on reliability:

```yaml
version: '3'
services:
    laravel.test:
        # ... (Your existing web/app service definition)
        build:
            context: ./docker/8.0
            dockerfile: Dockerfile
        # ... other settings

    php-queue:
        restart: always
        image: sail-8.0/app:latest
        # Use an entrypoint that ensures the environment is loaded correctly, 
        # rather than just a direct command execution if possible.
        entrypoint: /bin/bash 
        volumes:
            - '.:/var/www/html'
        # We run the worker explicitly as a detached background process
        command: sh -c "while true; do php artisan queue:work --sleep=1; done"

    mysql:
        # ... (Your existing database setup)
        # ...

    redis:
        # ... (Your existing redis setup)
        # ...
```

**Explanation of the Change:** We changed the `command` to an explicit shell loop (`while true; do php artisan queue:work --sleep=1; done`). This forces the container process to continuously execute the worker command, preventing it from immediately exiting and causing Docker to register a failed service. The `--sleep=1` parameter is crucial for queue workers as it tells the process to pause briefly between cycles, reducing CPU usage while keeping the connection alive.

## Conclusion

Running asynchronous jobs via Docker requires treating the container not just as a transient execution environment, but as a persistent service. The error you encountered stems from a mismatch in how the application's user context is initialized within the container when executing arbitrary commands. By shifting from a simple command execution to a robust shell loop (`while true; do ... done`), we ensure that the queue worker process remains active and properly managed by Docker, allowing your Laravel application to handle background jobs reliably. Always prioritize stability and explicit process management when dealing with long-running services in containerized environments!

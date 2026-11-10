---
title: "Docker: How to organise an Laravel app with schedule and queue in a Docker way"
description: "Docker: How to Organise an Laravel App with Schedule and Queue in a Docker Way Hej there, navigating the world of containerization for complex applications..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Hej there, navigating the world of containerization for complex applications like Laravel can certainly feel overwhelming. When you start splitting your application into microservices—Nginx, PHP-FPM workers, database, queue processors, and schedulers—the primary challenge shifts from writing Laravel code to managing the inter-container communication and file system access.

The dilemma you face regarding copying files versus using volumes is a classic Docker architecture problem. As a senior developer, I can tell you that for dynamic application environments like Laravel, **volume mounting is the overwhelmingly superior approach.** It provides persistence, simplifies development workflows, and allows all services to share the exact same codebase instantly.

Let's break down how to solve this complex setup effectively, ensuring your scheduled tasks and queue workers run seamlessly within your Docker ecosystem.

## The Power of Volume Mounting for Laravel Applications

When dealing with a framework like Laravel, where code changes frequently and environment variables dictate behavior, copying files into the image is brittle and requires rebuilding the image for every change. Using volumes solves this by mounting your local project directory directly into the container.

### Why Volumes Win

1.  **Development Speed:** You edit files locally, and the changes are immediately reflected inside the running containers. This eliminates the tedious cycle of rebuilding images just to test a minor code tweak.
2.  **Persistence:** Data (like uploaded files or session caches) can be managed persistently outside the container lifecycle.
3.  **Consistency:** Every service—whether it’s the web server serving assets, the queue worker processing jobs, or the scheduler checking times—operates on the identical code base.

For Laravel applications, this aligns perfectly with best practices for deploying robust systems, much like adhering to principles outlined by organizations focusing on modern application architecture, such as those promoted by [laravelcompany.com](https://laravelcompany.com).

## Orchestrating Queues and Schedulers in Docker Compose

The difficulty you face regarding starting the queue and schedule workers is not about *where* the files are, but *how* to define the processes that run continuously within those containers.

Instead of trying to cram all logic into a single PHP-FPM service, we should separate concerns: one container for the web serving (Nginx), one for the application runtime (PHP-FPM), and dedicated services or command overrides for background jobs.

### Implementation Strategy: Shared Code and Dedicated Workers

Here is how you structure your `docker-compose.yml` to handle this setup:

1.  **Define a Shared Volume:** Create a named volume to hold your application code, ensuring all PHP/worker containers mount this same location.
2.  **Mount the Code:** Mount this volume into every service that needs access to the Laravel files.
3.  **Isolate Workers:** Define separate services specifically for running queue workers (like Horizon or standard queue listeners) and scheduled tasks. These services will use the mounted code to execute Artisan commands, ensuring they are not accidentally running within the Nginx web server context.

### Code Example: A Conceptual `docker-compose.yml` Snippet

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:stable-alpine
    volumes:
      # Mount the application code for Nginx to serve assets
      - ./public:/var/www/html/public
      - ./src:/var/www/html/src
    ports:
      - "80:80"
    depends_on:
      - php

  php_fpm:
    build: . # Assumes you have a Dockerfile set up for Laravel
    volumes:
      # Mount the application code for PHP processing
      - ./src:/var/www/html
    working_dir: /var/www/html
    command: php-fpm

  queue_worker:
    build: . # Uses the same base image
    volumes:
      # Essential: Ensure workers see the code and configuration
      - ./src:/var/www/html
    command: sh -c "while true; do php artisan queue:work; sleep 1; done" # Example worker command

  scheduler:
    build: . # Uses the same base image
    volumes:
      - ./src:/var/www/html
    command: sh -c "while true; do php artisan schedule:run; sleep 60; done" # Example scheduler command

  database:
    image: mariadb:10.6
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

As you can see, the `queue_worker` and `scheduler` services explicitly mount the application code volume (`./src`) alongside the PHP-FPM service. This ensures that when these containers execute commands like `php artisan queue:work`, they have full access to the necessary classes, configuration files, and environment setup required by Laravel.

## Conclusion

Stop wrestling with file copying! Embrace Docker's philosophy of immutability and shared state by leveraging **volumes**. By mounting your application code into all relevant services and defining specific commands for your queue and schedule workers, you create a flexible, scalable, and highly maintainable deployment. This approach ensures that your Laravel application, regardless of whether it’s being served by Nginx or processing background jobs, operates from the exact same source of truth, making development and deployment significantly smoother.

---
title: "Run laravel queue worker in docker"
description: "Running Laravel Queue Workers Effectively in Docker: Avoiding the 502 Gateway Error Running background jobs, especially queue workers, is crucial for any..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Running background jobs, especially queue workers, is crucial for any robust application built with Laravel. When you containerize your application using Docker and Docker Compose, a common hurdle developers face is getting these long-running processes—like `php artisan queue:work --daemon`—to run reliably without disrupting the web server (like Nginx) or causing connection timeouts (the infamous 502 Bad Gateway error).

This post will dive deep into why you are encountering issues, and provide a robust, production-ready architecture for running your Laravel queue workers inside Docker.

## The Root Cause: Why You Get a 502 Error

The 502 Bad Gateway error typically occurs when the front-end web server (Nginx) successfully receives a request but cannot establish a connection with the backend application process it delegates the work to.

In your setup, if you try to force `php artisan queue:work` directly within the main PHP service container or via an entrypoint script that runs concurrently with FPM, you create a conflict. The web server expects the primary PHP process (often PHP-FPM) to handle requests. When a long-running command like a queue worker monopolizes resources or interferes with the expected request handling flow, Nginx loses connection, resulting in the 502 error.

The solution is simple but requires architectural separation: **Decouple your concerns.** The web server should only handle HTTP requests, and the queue worker should run as an independent, persistent background service.

## The Docker Compose Solution: Decoupling Services

Instead of trying to force the queue worker into the same container that serves web traffic, we leverage Docker Compose's ability to run multiple, isolated services communicating over a network. We will create three distinct services: `webserver` (Nginx), `app` (PHP-FPM/Application logic), and a dedicated `worker`.

### Step 1: Revising the `docker-compose.yml` for Separation

We need to modify your existing structure to introduce a separate service specifically for queue processing. This approach ensures that if the worker crashes or restarts, it does not affect the web server's ability to serve requests.

Here is how you should restructure your configuration:

```yaml
version: '3'
services:

  # Nginx Service (Handles HTTP traffic)
  webserver:
    image: nginx:alpine
    container_name: LibraryWebserver
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/var/www
      - ./nginx/conf.d/:/etc/nginx/conf.d/
    networks:
      - app-network

  # MySQL Service (Database)
  db:
    image: mysql:5.7.22
    container_name: Librarydb
    restart: unless-stopped
    tty: true
    volumes:
      - dbdata:/var/lib/mysql
    environment:
      MYSQL_DATABASE: library
      MYSQL_ROOT_PASSWORD: Library!23
      MYSQL_USER: root
      MYSQL_PASSWORD: Library!23
      SERVICE_TAGS: dev
      SERVICE_NAME: mysql
    networks:
      - app-network

  # PHP Application Service (Handles web requests)
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: hoseinnormohamadi/lumen:Library
    container_name: LibraryApp
    restart: unless-stopped
    tty: true
    environment:
      SERVICE_NAME: app
      SERVICE_TAGS: dev
    working_dir: /var/www
    volumes:
      - ./:/var/www
    networks:
      - app-network

  # Dedicated Queue Worker Service (Runs background jobs)
  worker:
    build:
      context: .
      dockerfile: Dockerfile # Use the same base image, potentially a smaller one if only PHP is needed
    image: hoseinnormohamadi/lumen:Library
    container_name: LibraryWorker
    restart: always
    volumes:
      - ./:/var/www
    environment:
      SERVICE_NAME: app
      SERVICE_TAGS: dev
    networks:
      - app-network

# Docker Networks and Volumes remain the same
networks:
  app-network:
    driver: bridge
volumes:
  dbdata:
    driver: local
```

### Step 2: Implementing the Queue Worker Command

Now that we have a dedicated `worker` service, we define its entrypoint to execute the queue command. For long-running processes in Docker, it's best practice to use an explicit shell script or direct execution within the container's entrypoint.

In your application's `Dockerfile` or by defining a custom entrypoint for the `worker` service, you will ensure that when this container starts, it immediately runs the queue command and keeps running:

```bash
# Example entrypoint modification (in Dockerfile or docker-compose run)
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["php artisan queue:work --daemon"]
```

By setting `restart: always` on the `worker` service, Docker ensures that if the worker process is killed for any reason, it will automatically be restarted, making your queue processing highly resilient. This separation pattern aligns perfectly with the principles of scalable microservices often discussed in the Laravel ecosystem, emphasizing clear boundaries between web responsibilities and background processing.

## Conclusion: Building Resilient Laravel Applications

Running queue workers within Docker requires shifting your mindset from running a single monolithic command to designing a multi-service architecture. By decoupling your concerns—separating HTTP serving (Nginx/App) from background processing (Worker)—you eliminate the conflict that causes 502 errors and create an application that is both scalable and resilient.

Remember, leveraging Docker Compose allows you to manage complex dependencies efficiently. As you continue to build sophisticated applications using Laravel, embracing this containerized approach ensures your infrastructure scales alongside your code. For more deep dives into how Laravel integrates with modern infrastructure, always check out resources from [laravelcompany.com](https://laravelcompany.com). Happy coding!

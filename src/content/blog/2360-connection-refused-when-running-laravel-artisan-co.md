---
title: "Connection refused when running Laravel artisan command with Docker"
description: "Connection Refused When Running Laravel Artisan Commands with Docker: A Senior Developer's Guide Running modern applications within Docker containers is a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

Running modern applications within Docker containers is a massive productivity booster, but it often introduces subtle networking challenges. One of the most frustrating issues developers encounter is the infamous `SQLSTATE[HY000] [2002] Connection refused` error when trying to run migrations or execute database queries via `php artisan`.

This post will dissect why this connection refusal happens in a Laravel/MySQL Docker setup, review your configuration, and provide the robust solutions necessary to ensure seamless communication between your application container and your database container.

## Understanding the "Connection Refused" Error

When you see `Connection refused`, it signifies that the client (your PHP process inside the Laravel container) successfully found the IP address specified in the connection string (`DB_HOST=mysql`), but when it tried to establish a TCP connection on the specified port (`DB_PORT=8889`), the target machine actively rejected the connection attempt.

In the context of Docker Compose networking, this usually points to one of three core issues:

1.  **Service Not Running/Not Ready:** The database container might start before the MySQL server inside it is fully initialized and listening on the port.
2.  **Networking Misconfiguration:** Incorrect use of hostnames or ports between services.
3.  **Port Mapping Conflict:** A mismatch between the internal service port and the external port exposed by Docker Compose.

## Analyzing Your Setup

Let's review the configuration you provided to pinpoint the potential issue:

**`docker-compose.yml` Snippet Review:**

```yaml
services:
  app:
    # ...
    depends_on:
      - mysql
    # ...
  mysql:
    image: mariadb:latest
    ports:
      - 8889:80 # Host port mapping
    environment:
      MYSQL_ROOT_PASSWORD: 'dev'
      # ...
```

**`.env` Snippet Review:**

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=8889
# ...
```

Your configuration correctly uses the service name (`mysql`) as the hostname, which is the correct practice within a Docker Compose network. However, relying solely on `depends_on` often isn't enough to guarantee that the database server itself has finished initializing before the application attempts the connection.

## The Solution: Ensuring Database Readiness

The most reliable way to solve this is to introduce a mechanism that pauses the application startup until the database service is confirmed to be reachable and ready to accept connections. This shifts the dependency from simple *ordering* (`depends_on`) to actual *readiness*.

### Step 1: Implement Health Checks (Best Practice)

Instead of just relying on `depends_on`, we need a way for the Laravel application to wait

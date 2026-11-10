---
title: "Can not connect mysql with laravel (docker)"
description: "Solving the MySQL Connection Nightmare in Dockerized Laravel Applications As a senior developer, I’ve seen countless developers hit roadblocks when setting..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless developers hit roadblocks when setting up modern application stacks using Docker. Connecting services—especially databases to application containers—is often where the complexity lies. You have the PHP/Laravel application container and the MySQL database container running side-by-side, but when you try to run migrations, the connection is refused.

This post will walk you through exactly why this happens in a Docker environment and provide the definitive solution for connecting your Laravel application to its MySQL database successfully.

## The Connection Refused Mystery: Why Does It Happen?

You are encountering the error `SQLSTATE[HY000] [2002] Connection refused` when running `php artisan migrate`. This is a classic networking issue within Docker Compose setups.

When services are defined in `docker-compose.yml`, they run on an isolated virtual network. While you successfully map ports to the host machine (e.g., mapping port 3306 from the MySQL container to your host machine), the PHP application container needs a way to communicate *internally* with the MySQL container.

The core issue is usually how you specify the database host in your environment variables, which dictates where the PHP container attempts to establish the connection.

## Analyzing Your Docker Setup

Let's look at the configuration you provided:

**`docker-compose.yml` Snippet Review:**
Your `docker-compose.yml` correctly defines three services: `php`, `nginx`, and `db` (MySQL). The service names (`php`, `db`) automatically create an internal network where these containers can communicate with each other using their service names as hostnames.

**The Problem in Your `.env` File:**
Your environment file currently specifies:
```dotenv
DB_HOST=127.0.0.1
```
While `127.0.0.1` (localhost) works perfectly *inside* a single container, it does not resolve to the MySQL service running on a separate, networked container in Docker Compose. When the PHP container tries to connect to `127.0.0.1:3306`, it is looking for MySQL on its own localhost interface, not on the network defined by Docker Compose. This results in a "Connection refused" error because no service is listening at that specific address from the perspective of the PHP container.

## The Solution: Using Service Names as Hostnames

The correct way to establish communication between services within a Docker Compose setup is to reference the **service name** defined in the `docker-compose.yml` file as the hostname for your database connection.

### Step 1: Update Your `.env` File

You need to change `DB_HOST` from `127.0.0.1` to the service name you gave your MySQL container, which is `db`.

**Corrected `.env` File:**
```dotenv
DB_CONNECTION=mysql
DB_HOST=db             # <-- CHANGE THIS TO THE SERVICE NAME
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=docker
DB_PASSWORD=docker
```

### Step 2: Ensure PHP Can See the Network

By setting `DB_HOST=db`, you are telling the Laravel application container to connect to the service named `db` on the Docker network. This utilizes Docker's internal DNS resolution, allowing the connection to be successfully routed across the containers.

With this adjustment, when you run `php artisan migrate`, the PHP process will correctly resolve the hostname `db` to the internal IP address of the MySQL container, and the database connection will succeed.

## Best Practices for Laravel and Docker Networking

When working with frameworks like Laravel in a Docker environment, always remember these networking rules:

1.  **Use Service Names:** Always use the service name defined in `docker-compose.yml` (e.g., `db`, `redis`) as the host address inside your application code or environment files instead of `localhost` or `127.0.0.1`.
2.  **Separate Concerns:** Keep your database, application, and other services in separate containers. This makes scaling and debugging much easier. As you build robust systems, think about how external services interact—this is a key principle of modern development practices advocated by companies like Laravel.
3.  **Volume Mapping vs. Networking:** Remember that volume mapping (`volumes: - ./myapp/:/var/www`) handles file persistence, while networking (using service names) handles inter-container communication. Both are essential!

## Conclusion

The "Connection refused" error in a Dockerized setup is rarely about the database server being down; it’s almost always a simple configuration mistake regarding network addressing. By switching `DB_HOST` to your MySQL service name (`db`), you bridge the gap between the PHP application and the MySQL database, allowing your Laravel migrations and subsequent operations to run smoothly. Happy coding!

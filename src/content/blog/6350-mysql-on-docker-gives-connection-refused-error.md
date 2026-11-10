---
title: "Mysql on docker gives \"Connection refused\" error"
description: "MySQL on Docker Gives \"Connection Refused\": A Deep Dive into Docker Networking Issues As developers leveraging Docker and Docker Compose for local..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers leveraging Docker and Docker Compose for local development environments—especially with frameworks like Laravel—we often encounter frustrating connectivity errors. The specific issue you’re facing, `SQLSTATE[HY000] [2002] Connection refused`, when trying to connect a PHP application inside a container to a MySQL database also running in another container, is almost always a networking configuration problem, not an error in the SQL syntax or the credentials themselves.

This post will dissect why this happens in a Docker setup and provide the definitive solution.

## Understanding the "Connection Refused" Error in Docker

When you run `php artisan migrate` inside your PHP container, it attempts to connect to the MySQL server using the host specified in your `.env` file (in your case, `DB_HOST=127.0.0.1`). The error "Connection refused" means that the operating system successfully found an address on that IP (`127.0.0.1`), but there was no service actively listening on that port (`3306`) to accept the connection request.

In a standard Docker Compose setup, containers are isolated environments. They do not share the host machine's `localhost` by default in the way you might expect when running commands inside them. A container must communicate with another container using the *service name* defined in the `docker-compose.yml` file as the hostname, leveraging Docker’s internal networking bridge.

## Analyzing Your Configuration: The Networking Mismatch

Let's look closely at the configuration you provided to pinpoint the exact discrepancy:

**Your `.env` File Snippet:**
```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
# ... other variables
```

**Your MySQL Service in `docker-compose.yml`:**
The service is named `db`. Docker Compose automatically sets up a network where containers can resolve each other using their service names.

When the PHP container tries to connect to `127.0.0.1:3306`, it is attempting to connect to a MySQL server running *inside* the PHP container itself, not the separate `db` container. This connection fails because the intended MySQL database is listening on the network bridge, not on the PHP container's loopback interface.

## The Solution: Using Service Names for Host Addressing

The correct way for containers within the same Docker Compose network to communicate is by using the **service name** defined in the `docker-compose.yml` file as the hostname. Since your MySQL service is named `db`, the PHP container must address it as `db`.

### Step 1: Correcting the `.env` File

You need to change the `DB_HOST` to use the service name (`db`) instead of a host IP address that refers to the container itself (`127.0.0.1`).

**Corrected `.env` File:**
```dotenv
DB_CONNECTION=mysql
DB_HOST=db          # <-- CHANGE THIS: Use the service name defined in docker-compose.yml
DB_PORT=3306
DB_DATABASE=fhblog
DB_USERNAME=fhblog
DB_PASSWORD=root
```

### Step 2: Ensuring Proper Network Setup

For this to work seamlessly, ensure that both your PHP application service and your MySQL service are part of the same network. Your provided snippet suggests you are using a custom network (`app-network`), which is good practice. Ensure your `docker-compose.yml` explicitly links all services to this shared network.

Here is how a typical working setup looks:

```yaml
version: '3.8'

services:
  db:
    image: mysql:5.7.22
    container_name: mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_USER: root
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: fhblog
      MYSQL_USER: fhblog
      MYSQL_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - ./docker/mysql/db:/var/lib/mysql
      - ./docker/mysql/my.cnf:/etc/mysql/my.cnf
    networks:
      - app-network # <-- Connect to the shared network

  app:
    build: .
    container_name: laravel_app
    depends_on:
      - db # Ensures MySQL starts before the application tries to connect
    environment:
      # These environment variables should align with your .env file pointing to 'db'
      DB_CONNECTION: mysql
      DB_HOST: db 
      DB_PORT: 3306
      DB_DATABASE: fhblog
      DB_USERNAME: fhblog
      DB_PASSWORD: root
    volumes:
      - .:/var/www/html

networks:
  app-network:
    driver: bridge
```

## Conclusion

The "Connection refused" error in a Dockerized Laravel setup is almost always solved by understanding container networking. Stop relying on `127.0.0.1` when connecting services across containers. Instead, adopt the principle of service discovery: use the service name defined in your `docker-compose.yml` (e.g., `db`) as the hostname for database connections within your application's environment variables. This approach ensures that your Laravel application correctly interacts with the MySQL server running in its isolated container, adhering to best practices for container orchestration shown by platforms like those supported by **Laravel Company**. Happy coding!

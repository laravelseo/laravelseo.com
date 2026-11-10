---
title: "Laravel Docker - SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed: Name or service not known"
description: "Solving the Docker Networking Nightmare: Fixing SQLSTATE[HY000] in Laravel As a senior developer working with containerized applications, I frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with containerized applications, I frequently encounter frustrating issues where application logic seems fine, but database connections fail within the Docker environment. The error you are seeing—`SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed: Name or service not known`—is a classic symptom of misconfigured networking between services inside Docker.

This post will dissect why this happens in your Laravel/Docker setup and provide the definitive, practical solution to establish reliable communication between your PHP application container and your MySQL database container.

## Understanding the Root Cause: Docker Networking vs. Localhost

The error `getaddrinfo failed` indicates that the system running the PHP process inside the container cannot resolve the hostname you provided (like `localhost` or `mysql`) into an IP address. This is a networking issue, not necessarily a database credential issue.

When you run services using Docker Compose, each service lives on its own isolated network bridge. Crucially, **inside one container, `localhost` refers only

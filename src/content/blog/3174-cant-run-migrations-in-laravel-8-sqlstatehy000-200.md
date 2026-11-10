---
title: "Can't run migrations in Laravel 8: SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed: Name or service not known"
description: "Solving the Dreaded getaddrinfo failed Error During Laravel Migrations As a senior developer, I’ve seen countless issues plague developers as they try to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless issues plague developers as they try to set up new projects or deploy existing ones. One of the most frustrating errors is when the application logic seems fine, but the underlying database operations fail with cryptic system-level errors. The specific error you are encountering—`SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed: Name or service not known` during Laravel migrations—is a classic symptom that points away from Laravel's code and directly toward network configuration issues.

This post will dissect this error, explain why it happens even in seemingly perfect environments like Kali Linux, and provide the definitive steps to resolve it.

---

## Deconstructing the `getaddrinfo failed` Error

When you run `php artisan migrate`, Laravel attempts to establish a connection with your configured database server (e.g., MySQL, PostgreSQL). The error message you see is not an error originating from the database itself; it’s an operating system-level networking failure.

The function `getaddrinfo` is responsible for resolving a hostname (like `localhost` or a specific IP address) into an actual network address (an IP address). When this function fails with "Name or service not known," it means the machine attempting the connection cannot translate the database host name into an accessible IP address.

**In simple terms: Your application can’t find the database server on the network.**

This failure occurs *before* Laravel even attempts to execute the SQL query; it happens during the initial attempt to establish the TCP/IP connection. Since you mentioned this happens on a clean install of Laravel 8 on Kali Linux, the problem is almost certainly rooted in the operating system or environment configuration, not PHP or Laravel itself.

## Root Causes and Practical Solutions

Since the issue is network-related, we need to troubleshoot the connectivity layer first. Here are the three most common culprits:

### 1. Incorrect Database Hostname Configuration

The most frequent cause is an incorrect hostname specified in your `.env` file. If you are using `localhost`, system settings or virtualization layers might misinterpret this address.

**Action:** Double-check your `.env` file connection details. Ensure the host is correctly pointing to the database server's actual network address, especially if you are running services inside a Docker container or a Virtual Machine (VM).

```dotenv
DB_HOST=127.0.0.1  # Try using IP address instead of 'localhost'
DB_PORT=3306
DB_DATABASE=your_db_name
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

### 2. DNS Resolution Failure (The `getaddrinfo` Issue)

If the hostname is correct, the machine running Artisan might be failing to resolve that name. This points directly to a DNS or network stack issue on your Kali Linux environment.

**Action:** Test basic network connectivity from the terminal where you run the Artisan command:

```bash
ping database_hostname  # Replace with your DB host
nslookup database_hostname # Test DNS resolution specifically
```

If these commands fail, it confirms a fundamental networking problem rather than a Laravel bug. Ensure that the machine running the application has proper network routes and DNS settings configured for accessing the database server.

### 3. Firewall Interference

A local firewall (like `ufw` on Kali) or network security policies might be blocking the necessary outbound connections required for name resolution, causing `getaddrinfo` to fail.

**Action:** Temporarily check if disabling the firewall allows the migration to run. If it does, you need to configure specific rules to allow traffic on the required ports (e.g., 3306 for MySQL) and DNS lookups.

## Best Practices for Robust Laravel Environments

When setting up environments, especially in containerized or complex VM setups, focus on environment isolation. Following best practices ensures that framework issues are minimized, allowing you to focus debugging efforts on the network layer. For robust application development, ensure your setup adheres to principles emphasized by the Laravel community, which promotes clean, reproducible deployments and configurations—as detailed by resources like those found at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

The error `SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed` during Laravel migrations is rarely a fault in the framework itself. It is almost always an indicator of a broken network path or incorrect hostname configuration between your application environment and the database server. By systematically checking your `.env` file settings, testing DNS resolution with tools like `ping`, and reviewing local firewall rules, you will isolate this network dependency and get your migrations running smoothly.

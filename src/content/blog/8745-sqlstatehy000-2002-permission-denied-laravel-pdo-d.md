---
title: "SQLSTATE[HY000] [2002] Permission denied Laravel PDO Driver (credentials working via artisan migrate)"
description: "SQLSTATE[HY000] [2002] Permission Denied in Laravel PDO: Why migrate Works But Web Requests Fail As a senior developer, I’ve seen countless deployment and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless deployment and database connection issues. One of the most frustrating ones is when a system works perfectly during setup (like running migrations) but breaks immediately when a live application tries to execute simple queries. The error you are encountering—`SQLSTATE[HY000] [2002] Permission denied` in your Laravel PDO operation—is a classic symptom of mismatched user permissions between the command-line environment and the web server environment.

This post will diagnose why this happens, focusing specifically on file system permissions and socket access, and provide the definitive steps to resolve this common pitfall when setting up Laravel on Linux servers.

## Understanding the Discrepancy: CLI vs. Web Server Permissions

The core of your problem lies in the difference between the user executing `php artisan migrate` (usually your deployment user or root) and the user running PHP via Nginx/FPM (often `www-data`).

When you run `php artisan migrate`, you are typically operating as a specific system user that has full access to the MySQL socket (`/mnt/volume_sfo2_01/mysql_data/mysqld.sock`) and the database files. This is often because the CLI session inherits permissions differently, or the user running the command has broader sudo privileges for setup tasks.

However, when Laravel runs during a web request, the PHP process (running as `www-data` on Ubuntu) attempts to establish the connection using the same credentials but lacks the necessary file system permissions to read the socket or access the database files themselves. The "Permission denied" error is MySQL explicitly denying access because the connecting user doesn't have the required operating system privileges.

## Troubleshooting Steps: Fixing the Permission Denied Error

Since you are using a Unix socket connection, the issue almost always revolves around ownership and group permissions for that socket file and the underlying MySQL data directory.

### Step 1: Verify MySQL Socket Permissions

The most critical step is ensuring the web server user (e.g., `www-data`) has permission to access the socket and the data location.

First, confirm which user your web server runs as. On Ubuntu/Debian systems, this is typically `www-data`.

Next, check the permissions on the MySQL socket file:

```bash
ls -l /mnt/volume_sfo2_01/mysql_data/mysqld.sock
```

If the permissions look restrictive, you need to adjust them so that the web server user can read and connect. A common practice is ensuring the `www-data` group has access.

### Step 2: Adjust Ownership of MySQL Data Directory

Ensure that the user running PHP-FPM (`www-data`) owns or belongs to a group that has access to the database files.

If you are using a standard setup where MySQL runs as the `mysql` user, you must ensure the web server process can interact with it. While direct socket access is often managed by MySQL configuration, file permissions are the next layer of defense.

A safe approach is to grant appropriate read/write access to the relevant directories:

```bash
# Assuming www-data is the web server user
sudo chown -R www-data:www-data /mnt/volume_sfo2_01/mysql_data/
sudo chmod -R 750 /mnt/volume_sfo2_01/mysql_data/
```

### Step 3: Review MySQL Configuration (`my.cnf`)

While the socket path is defined in your PDO connection string, ensure that the MySQL configuration itself (usually `/etc/mysql/my.cnf` or similar) allows connections from different users and contexts. Specifically, check the `socket` directive to confirm it points to a location accessible by all necessary processes.

If you are managing user access strictly via the socket, confirming the permissions of the socket file itself is usually sufficient for resolving this specific error when using Unix domain sockets.

## Conclusion: Best Practices for Laravel Deployment

This issue highlights a fundamental principle in server administration: **separation of concerns** between command-line operations and web application execution. The solution is not about fixing Laravel code, but about correctly configuring the underlying operating system permissions that allow the PHP process to interact with the database daemon.

When deploying applications like those built with Laravel, always treat file system permissions as a first-class concern. Before deployment, ensure that the user account running the web server (PHP-FPM) has explicit read/write access to all application directories and necessary configuration files. This practice ensures stability and security, which aligns perfectly with the robust structure provided by frameworks like those found on [laravelcompany.com](https://laravelcompany.com). By correctly managing these permissions, you ensure that both your CLI tools and your live web requests operate within the expected boundaries of the system.

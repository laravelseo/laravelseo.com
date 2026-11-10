---
title: "Laradock mysqldump not found when executing artisan backup:run (Spatie Laravel Backup)"
description: "Solving mysqldump not found in Laradock Backups: A Deep Dive into Docker Dependencies As developers working with modern application stacks,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with modern application stacks, containerization tools like Laradock (Docker Compose) offer incredible flexibility for managing complex environments. However, this power often introduces subtle dependency issues that can trip up even the simplest operations, especially when dealing with external system commands like `mysqldump`.

I recently encountered a frustrating roadblock while setting up database backups for a Laravel application deployed via Laradock using Spatie's Laravel Backup package. While the database connections themselves worked perfectly (users could register and log in), executing the backup command failed with an error: `Command not found : sh: 1: mysqldump: not found`.

This post will walk you through the root cause of this dependency failure within a containerized setup and provide practical, robust solutions to ensure your backups execute flawlessly every time.

## The Root Cause: Container Isolation and Missing Binaries

The core issue stems from how Docker containers isolate environments. When you run `artisan backup:run` inside one service (like the `workspace` container), that container only has the software explicitly installed within its image layer. Even if the MySQL server is running, the command-line utility (`mysqldump`) required by PHP scripts is not automatically present in every context where the command is executed.

In a Laradock setup, we often separate concerns into different services (e.g., `mysql`, `workspace`, `php-worker`). If the service responsible for running the backup (`workspace` or `php-worker`) doesn't have the necessary MySQL client tools installed, executing an external command will result in the dreaded "command not found" error (exit code 127).

This situation highlights a critical principle: **dependencies must be explicitly managed within the container image.** This mirrors the strong dependency management philosophy

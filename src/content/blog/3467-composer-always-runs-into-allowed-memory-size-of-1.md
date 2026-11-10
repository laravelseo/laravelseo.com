---
title: "Composer always runs into \"Allowed memory size of 1610612736 bytes exhausted\" - on server as well as local"
description: "Composer Memory Exhaustion: Solving the Dreaded \"Allowed memory size exhausted\" Error on Server and Local As a senior developer, I’ve seen countless..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless frustrating roadblocks during dependency management. One of the most common—and maddeningly elusive—errors is the `Allowed memory size of X bytes exhausted` message when running command-line tools like Composer. You are right to be puzzled, especially when the exact same error appears locally on your Mac *and* on a remote development server. This strongly suggests the issue lies not with your project code itself, but with the execution environment's configuration.

This post will dive deep into why this happens during Composer operations and provide robust, scalable solutions that work regardless of whether you are working locally or on a shared hosting environment.

## Understanding the Memory Limit Conflict

The error message points directly to PHP hitting its configured memory limit while executing a process—in this case, Composer. When Composer runs dependency resolution, reads massive package metadata from Packagist, and resolves complex dependency trees for a project like a Laravel application, it consumes significant RAM.

The core conflict is this: **PHP's default memory limit, set at the server level, is too restrictive for the intensive tasks Composer performs.**

Your command `php -d memory_limit=-1 composer update` works by temporarily overriding this setting *only* for that specific PHP execution. The fact that you cannot use this workaround on your server highlights the need for a permanent solution within the server's configuration, rather than a temporary runtime flag.

## Diagnosing the Environment: Why It Happens on the Server

When you run Composer commands via SSH on a remote server, the process is executed by the PHP binary installed there. The memory limit is governed by the `php.ini` file or specific execution environment settings for that PHP installation.

Looking at your project setup (Laravel 6, PHP 7.3.18), the issue often stems from the default limits placed on CLI operations. While Composer itself is a tool, it relies entirely on the underlying PHP interpreter to execute its logic. If the server administrator has set a low limit for command-line scripts or web requests, Composer will fail instantly when memory demands spike during package resolution.

## Practical Solutions for Server Environments

Since you cannot easily manipulate the local environment settings on your remote server, we must focus on configuration changes that affect the CLI execution.

### 1. Modifying `php.ini` (The Permanent Fix)

The most reliable fix is to increase the memory limit within the PHP configuration file (`php.ini`). This change dictates how much memory the PHP process can request before being terminated.

**Steps:**
1. Locate your `php.ini` file on the server. (You can usually find this by running `php --ini` in the terminal.)
2. Find the line: `memory_limit = XXX`
3. Increase the value. For large dependency installations, setting it to a high value like `2G` or `-1` (unlimited) is often necessary for CLI tasks.

**Example Modification:**

If you change it to unlimited:
```ini
memory_limit = -1
```

If you need a specific large amount (e.g., 2 Gigabytes):
```ini
memory_limit = 2048M
```

After saving the file, you must restart the web server or PHP service for the changes to take effect:
```bash
sudo service php*-fpm restart  # Or relevant service command
```

### 2. Using Environment Variables (

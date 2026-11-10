---
title: "Laravel 5.7 jobs queue not running async"
description: "Laravel Jobs Queue Not Running Async: Why Your Jobs Are Blocking Execution As a senior developer working with Laravel, managing background jobs efficiently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel, managing background jobs efficiently is crucial for building responsive applications. When you dispatch a job, the expectation is that the main application thread should remain free while the heavy lifting happens in the background—asynchronously. If your jobs are blocking your application flow instead of running in parallel, it usually points to a misconfiguration in how Laravel is handling the queue connection.

This post will diagnose why your Laravel 5.7 setup might be behaving synchronously and provide the definitive steps to configure a truly asynchronous job processing system.

## Diagnosing the Problem: The Role of `sync`

The core issue lies in your environment configuration, specifically the `QUEUE_CONNECTION`. Based on the snippet you provided:

```ini
QUEUE_CONNECTION=sync
```

When you set the queue connection to `sync`, Laravel bypasses the entire queuing mechanism. Instead of pushing the job onto an external broker (like Redis or a database table) for later processing by a separate worker, the job is executed *immediately* within the same request that calls `dispatch()`. This results in blocking behavior, which is exactly what you are experiencing—the job runs synchronously, freezing your web request until it completes its database operations.

To achieve true asynchronous processing, you must use a driver that separates the dispatching of the job from its execution.

## The Solution: Implementing Asynchronous Queuing

For jobs to run asynchronously, two components are essential:
1. **A Queue Driver:** A system (like Redis, Beanstalkd, or Database) to hold the queued jobs.
2. **A Queue Worker:** A separate, long-running PHP process that constantly monitors the queue and executes the waiting jobs.

Since you are using Laravel 5.7, while the core job dispatching mechanism remains the same, we need to change the connection settings to utilize a proper external queue system.

### Step 1: Configuring the Queue Connection

You should switch from `sync` to a more robust driver. For many applications, the `database` driver (which you have already set up) or Redis are excellent choices.

In your `.env` file, change the connection setting:

```ini
BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=database  # Or 'redis', depending on your infrastructure
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

### Step 2: Ensuring the Database Setup is Correct

You have correctly configured the `database` connection in `config/queue.php`:

```php
'database' => [
    'driver' => 'database',
    'table' => 'jobs',
    'queue' => 'default',
    'retry_after' => 90,
],
```

When using the `

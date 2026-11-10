---
title: "Running multiple Laravel queue workers using Supervisor"
description: "Running Multiple Laravel Queue Workers Efficiently with Supervisor: Scaling Your Processing Power As a senior developer working with large scale applications..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with large-scale applications built on Laravel, managing background jobs efficiently is critical. When dealing with long-running tasks—like the 10-minute jobs you described—relying on process managers like Supervisor to keep queue workers alive is a solid start. However, simply running a static number of workers doesn't account for fluctuating load.

This post tackles two core challenges: how to easily launch multiple workers and, more importantly, how to scale those workers dynamically based on the actual backlog. We will explore how to optimize your setup using Supervisor and introduce architectural patterns that align with best practices in the Laravel ecosystem.

## 1) Running Multiple Queue Workers Simultaneously

The first step is understanding how Supervisor manages processes. Since each worker process runs independently, you can easily launch multiple instances of the same command to consume jobs from the same queue simultaneously.

Your current configuration defines a single worker:

```ini
[program:laravel_queue]
command=php artisan queue:listen --timeout=1800 --tries=5
directory=/var/app/current
stdout_logfile=/var/app/support/logs/laravel-queue.log
# ... other settings
autorestart=true
```

To run three separate workers on the same queue, you simply create three distinct Supervisor programs, each pointing to this command. This effectively multiplies your processing capacity without changing how Laravel handles the queue itself:

**Example Supervisor Configuration:**

You would define three identical programs in your Supervisor configuration file (e.g., `/etc/supervisor/conf.d/queue_workers.conf`):

```ini
[program:laravel_queue_worker_1]
command=php artisan queue:listen --timeout=1800 --tries=5
directory=/var/app/current
stdout_logfile=/var/app/support/logs/laravel-queue_1.log
autostart=true
autorestart=true

[program:laravel_queue_worker_2]
command=php artisan queue:listen --timeout=1800 --tries=5
directory=/var/app/current
stdout_logfile=/var/app/support/logs/laravel-queue_2.log
autostart=true
autorestart=true

[program:laravel_queue_worker_3]
command=php artisan queue:listen --timeout=1800 --tries=5
directory=/var/app/current
stdout_logfile=/var/app/support/logs/laravel-queue_3.log
autostart=true
autorestart=true
```

By defining these separately, Supervisor will manage three independent processes running the same command. This is the simplest way to increase concurrency for a fixed load scenario. When you are looking to build robust systems, understanding process management tools like Supervisor is fundamental, especially when managing services within a Laravel deployment built on robust foundations, much like those promoted by the official framework resources on sites such as https://laravelcompany.com.

## 2) Dynamic Scaling Based on Queue Backlog (The Advanced Approach)

Your second question—scaling workers based on demand (busy vs. quiet times)—moves us from static process management to dynamic orchestration. Running three or five

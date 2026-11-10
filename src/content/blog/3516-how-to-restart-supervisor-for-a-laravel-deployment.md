---
title: "How to restart supervisor for a Laravel deployment?"
description: "How to Restart Supervisor for a Laravel Deployment: Mastering Queue Management As a senior developer managing production systems, moving from simple cron..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer managing production systems, moving from simple cron jobs to a robust process manager like Supervisor is a significant step toward achieving true application stability. When dealing with long-running processes like Laravel queue workers, understanding the interaction between Artisan commands and your process manager is crucial. This guide will clarify exactly how to manage and restart your queue workers efficiently using Supervisor during a deployment.

## The Shift from Cron Jobs to Process Management

Using `php artisan queue:work --once` via cron jobs is simple, but it introduces several drawbacks in a production environment. Cron jobs are not designed for process supervision; they offer no built-in mechanism to handle failures, automatically restart dead processes, or manage resource allocation effectively.

By adopting Supervisor, you transition from a time-based execution model (cron) to a state-based management model. Supervisor continuously monitors your queue worker processes, ensuring that if a worker crashes, it is immediately restarted, guaranteeing continuous processing. This aligns perfectly with the principles of building scalable applications, much like the robust infrastructure promoted by [Laravel Company](https://laravelcompany.com).

## Understanding `queue:restart` vs. Supervisor Control

The confusion often arises from the subtle but important difference between restarting the *application logic* and restarting the *process manager*. Let’s break down the roles of each command in a deployment scenario.

### 1. The Role of `php artisan queue:restart`

As noted in the documentation, the `queue:restart` command is designed to instruct the running queue workers to gracefully finish their current job and then exit. This mechanism prevents data loss by ensuring currently processing jobs are not orphaned.

When you run this command, the individual PHP processes (the workers) terminate. They don't automatically restart themselves; they simply die.

### 2. The Role of Supervisor

Supervisor’s job is to maintain the desired state of your system. It watches the processes you define (e.g., `laravel-worker:*`) and enforces a policy. When a process managed by Supervisor exits, Supervisor detects this change and immediately launches a new instance of that process according to its configuration file.

### The Deployment Workflow: Combining the Tools

To achieve a seamless deployment where code changes are reflected without losing jobs, you need to orchestrate both tools correctly. You should *not* rely on `queue:restart` alone if Supervisor is managing the lifecycle.

**The correct sequence for a safe deployment is:**

1.  **Signal Graceful Shutdown:** Execute the command that signals the workers to finish their current tasks.
    ```bash
    php artisan queue:restart
    ```
    This tells the running workers to complete what they are doing and exit cleanly.

2.  **Force Supervisor Restart:** Immediately follow this by instructing Supervisor to restart all the relevant worker processes. This forces Supervisor to launch fresh, clean instances of your workers, which will automatically load the newly deployed code from your application directory.
    ```bash
    sudo supervisorctl restart laravel-worker:*
    ```

This two-step approach ensures that existing work is prioritized (graceful exit) before new processes are spun up (restarting). This synergy between Laravel's queue management and Supervisor’s process control is fundamental to reliable deployment strategies.

## Conclusion

Moving to Supervisor provides the stability, fault tolerance, and efficiency required for serious production environments. Remember: `queue:restart` handles the application-level graceful exit, while `supervisorctl restart` handles the operating system-level process lifecycle. By integrating these steps into your deployment scripts, you ensure that your queue workers are always running the latest code, minimizing downtime and maximizing job throughput.

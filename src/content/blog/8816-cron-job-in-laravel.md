---
title: "Cron Job in Laravel"
description: "Mastering Scheduled Tasks: Setting Up Cron Jobs in Laravel As a developer, we often build powerful applications where certain tasks need to run..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a developer, we often build powerful applications where certain tasks need to run automatically—data synchronization, cache clearing, sending scheduled emails, or running background jobs. When you move from executing a command manually in your terminal to scheduling it to run automatically every 24 hours, you enter the world of **cron jobs**. If you are new to this concept, don't worry; setting up cron for Laravel commands is straightforward once you understand the underlying operating system mechanism.

This guide will walk you through exactly how to set up a reliable cron job to execute your existing Laravel command every day.

## Understanding Cron Jobs

A cron job is essentially a time-based job scheduler in Unix-like operating systems (Linux, macOS). It allows you to schedule commands or scripts to run automatically at specified times or intervals. Think of it as setting an alarm for your server: instead of manually logging in and running a command daily, you instruct the server's scheduler to execute that command for you.

For Laravel development, cron is crucial for maintenance tasks that don't require user interaction, such as nightly database cleanups or scheduled data migrations.

## The Challenge: Bridging the Console and Cron

You mentioned that the command works perfectly in your console but needs to run automatically every 24 hours. This difference lies in *how* the execution environment is established. When you type a command directly, your shell knows where the PHP executable and the Laravel framework are located within your current session. When cron runs a job, it operates in a minimal, non-interactive environment, meaning it doesn't automatically know the path to your project or the necessary environment variables.

To solve this, we must ensure that the cron command executes the script using absolute paths and within a defined environment context.

## Step-by-Step Guide for Laravel Cron Jobs

Here is the practical process for setting up a recurring task using cron on a Linux server:

### 1. Determine the Full Command Path

First, you need the absolute path to the PHP executable that is running your Laravel application. This step is critical for cron jobs to succeed. You can usually find this using the `which php` command on your server. For example, it might be `/usr/bin/php`.

Next, determine the full path to your Artisan command. If you are executing a command like `php artisan schedule:run`, you need the full path to that file within your project directory (e.g., `/var/www/html/my-laravel-app/artisan`).

### 2. Editing the Crontab File

Use the `crontab -e` command to edit your user's cron schedule. This will open a text editor where you define the schedule.

To run a command every 24 hours (e.g., at midnight), you would add a line like this:

```cron
0 0 * * * /usr/bin/php /var/www/html/my-laravel-app/artisan schedule:run >> /var/log/cron.log 2>&1
```

**Breaking down the cron entry:**
*   `0 0 * * *`: This is the schedule (Minute 0, Hour 0, Every Day of Month, Every Month, Every Day of Week). This schedules the command for midnight every day.
*   `/usr/bin/php`: The absolute path to the PHP interpreter.
*   `/var/www/html/my-laravel-app/artisan schedule:run`: The full, absolute path to the specific Artisan command you want to run.
*   `>> /var/log/cron.log 2>&1`: This redirects all output (both standard output and errors) into a log file, which is essential for debugging if the job fails.

### 3. Best Practices for Robust Execution

When setting up scheduled tasks in a production environment—especially when dealing with frameworks like Laravel where configuration matters—follow these best practices:

*   **Use Absolute Paths:** As demonstrated above, always use full, absolute paths for both the executable (PHP) and the script you are running. This eliminates ambiguity within the cron environment.
*   **Logging is Non-Negotiable:** Always redirect output to a log file (`>> /path/to/logfile 2>&1`). If your command fails (perhaps due to missing environment variables or permissions), this log file will contain the error messages, allowing you to debug issues without needing to access the terminal directly.
*   **Environment Variables:** Be mindful of how your application relies on environment variables (`.env` file). Ensure that the user account running the cron job has the necessary permissions and can access the correct environment context for your Laravel application, which ties into best practices advocated by organizations like the [Laravel Company](https://laravelcompany.com).

## Conclusion

Setting up a reliable cron job for a Laravel command involves understanding the operating system's scheduler and ensuring that the environment is correctly set up for non-interactive execution. By focusing on absolute paths and robust logging, you transform a manual process into an automated, dependable system. Start simple with testing your command in the cron setup first, and then expand to more complex scheduling as your needs evolve.

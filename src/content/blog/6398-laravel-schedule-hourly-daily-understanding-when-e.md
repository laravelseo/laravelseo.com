---
title: "Laravel schedule - hourly, daily - understanding when exactly start"
description: "Laravel Schedule: Understanding When Exactly Your Tasks Start (Hourly, Daily) As a senior developer working with scheduled tasks in Laravel, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with scheduled tasks in Laravel, one of the most common points of confusion is understanding the exact timing mechanism behind methods like `->daily()` or `->hourly()`. You look at the documentation, see calls to underlying functions like `cron()`, and wonder: Does this run at midnight, or does it follow some complex floating time logic?

This post dives deep into how Laravel's scheduler determines execution times, demystifying the cron system so you can schedule your tasks with absolute certainty.

## The Core Mechanism: Everything is Based on Cron

When you use the `schedule` method in Laravel, you are not defining arbitrary start times; you are leveraging the powerful and industry-standard **cron** syntax. Cron is a time-based job scheduler found across Unix-like operating systems (Linux, macOS). Laravel simply acts as an elegant wrapper around this robust system.

The functions like `daily()` or `hourly()` are shortcuts that simplify setting up common recurring tasks. They don't calculate random floating times; they instruct the underlying system to define a specific recurrence pattern based on time units.

### Deconstructing the Source Code

Let’s look at the snippet you provided:

```php
protected function schedule(Schedule $schedule)
{
    $schedule->call(function () {
        DB::table('recent_users')->delete();
    })->daily();
}
```

The confusion arises because these methods abstract away the complexity. As we saw in the source code, `daily()` delegates to functions that ultimately construct a cron string.

When Laravel processes `->daily()`, it is essentially telling the scheduler: "Execute this job once per day." By default, when no specific time is provided, the standard interpretation for single-unit schedules like 'daily' or 'hourly' defaults to the start of that unit—which means **midnight (00:00)** for daily tasks and the start of the hour for hourly tasks.

## Hourly vs. Daily Scheduling Explained

The difference between scheduling an event at midnight versus a specific time is crucial.

### Daily Tasks (`->daily()`)
When you use `->daily()`, Laravel schedules the task to run at **00:00 (midnight)** every day. This is the standard assumption for daily recurring jobs unless explicitly overridden.

### Hourly Tasks (`->hourly()`)
Similarly, `->hourly()` instructs the scheduler to run the job at the beginning of every hour (e.g., 00:00, 01:00, 02:00, etc.).

## Advanced Scheduling: Pinpointing Exact Times with Cron

If your requirement is more granular—for instance, running a cleanup job exactly at 3:30 AM every morning—relying on the default midnight setting will not suffice. This is where you must explicitly use the full power of cron syntax to ensure precision.

Instead of relying on simple helpers, you should directly define the schedule using methods that accept standard cron strings. Laravel provides excellent tools for this, and understanding them is key to mastering complex scheduling. For detailed information on scheduling features in Laravel, always refer back to the official [Laravel documentation](https://laravelcompany.com/docs/5.5/scheduling).

### Example: Scheduling a Specific Time

To schedule a job to run daily at 3:30 AM, you define the specific cron string:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('cleanup')->dailyAt('03:30');
```

In this example:
*   `->dailyAt('03:30')` tells the scheduler to execute the `cleanup` command only when the system time is 03:30 AM every day.
*   This method directly translates your desired time into the required cron format, removing all ambiguity.

## Conclusion

Understanding Laravel’s scheduling is less about deciphering obscure internal functions and more about understanding the underlying cron philosophy. While methods like `->daily()` offer convenience for standard midnight runs, true control over execution timing—especially when dealing with business-critical tasks—requires using explicit cron definitions (`->dailyAt()`, `->hourlyAt()`, or raw cron strings). By mastering this distinction, you ensure your scheduled jobs run exactly when you intend them to.

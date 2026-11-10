---
title: "Laravel 5 schedule job every 30 seconds"
description: "Mastering Frequent Scheduling in Laravel: Running Jobs Every 30 Seconds As a senior developer working with Laravel, managing scheduled tasks is a fundamental..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel, managing scheduled tasks is a fundamental part of building robust applications. Most developers start by using the built-in `schedule` command and configuring system cron jobs to run `php artisan schedule:run` every minute. This method is excellent for tasks that don't require millisecond precision.

However, when you need extremely tight timing—like executing a job every 10 or 30 seconds—the standard Laravel scheduler setup hits a limitation. The core issue lies in the polling mechanism; if your system cron runs the command only once per minute, no amount of setting `->everyThirtySeconds()` within `Kernel.php` will override that external constraint.

This post will dive into why the standard approach fails for sub-minute scheduling and provide practical, developer-focused solutions for achieving high-frequency job execution in Laravel.

## The Limitation of Standard Scheduling

When you use `$schedule->command('job')->everyThirtySeconds()`, Laravel registers this intent within the application's memory. However, the actual execution is still gated by how frequently your external cron setup invokes `php artisan schedule:run`. If your crontab only calls the command every 60 seconds, the scheduler will only process and dispatch jobs at those fixed intervals, preventing true sub-minute execution.

To achieve frequent, real-time scheduling, we must move away from relying solely on external system cron jobs for high-frequency tasks and instead leverage Laravel's powerful internal queueing and looping mechanisms.

## Solution 1: The Queue-Based Polling Strategy (Recommended)

For jobs that need to run frequently but don't necessarily require instantaneous execution across the entire server, the most robust pattern in a Laravel application is to use repeated queued jobs. Instead of trying to force the scheduler itself to poll faster than the OS allows, we make each job responsible for scheduling the *next* instance of itself.

This approach leverages Laravel Queues, which are designed for reliable background processing, as detailed on the [Laravel documentation](https://laravelcompany.com).

### Implementation Example: Self-Scheduling Jobs

We will create a dedicated job that schedules the next run interval.

**1. Create the Scheduling Job:**

```php
// app/Jobs/FrequentScheduler.php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan; // We will use Artisan here

class FrequentScheduler implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $intervalSeconds = 30; // Target interval in seconds

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        // Set the desired frequency here
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Calculate the next run time and dispatch it immediately
        $nextRunTime = now()->addSeconds($this->intervalSeconds);

        // Dispatch a new instance of this job for the next cycle
        FrequentScheduler::dispatch($nextRunTime);
    }
}
```

**2. Update the Kernel to Dispatch the Initial Run:**

Your `Kernel.php` schedule method should now be simplified, focusing only on kicking off the process:

```php
// app/Console/Kernel.php

protected function schedule(Schedule $schedule)
{
    // Kick off the initial sequence immediately
    $schedule->job(new FrequentScheduler())->scheduleAt(now()->addSeconds(30)); 
}
```

**3. Create the Runner Job:**

You would then create a separate job that handles the actual heavy lifting, which runs every time it is dispatched:

```php
// app/Jobs/CalculateInterestsJob.php

class CalculateInterestsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public function handle(): void
    {
        // Your actual heavy calculation logic here
        \Log::info('Running interest calculation at: ' . now());
    }
}
```

### Why This Works Better

This pattern shifts the responsibility from a static cron trigger to dynamic, queued execution. Instead of waiting for an external system to tell Laravel *when* to run, we use Laravel's queue system to instruct it to run itself repeatedly on a fixed interval. While this is not true real-time processing (it still operates within the constraints of your queue worker speed), it provides a highly reliable, scalable, and application-centric way to manage frequent background tasks, which aligns perfectly with best practices for scalable systems like those promoted by [Laravel](https://laravelcompany.com).

## Conclusion

Achieving sub-minute scheduling in Laravel requires shifting perspective from static cron definitions to dynamic job dispatching. For high-frequency tasks like running jobs every 30 seconds, relying on a self-scheduling queue pattern is significantly more reliable and scalable than attempting to force the standard scheduler into an impossible timing constraint. By embracing queues and iterative job dispatching, you ensure that your application handles frequent background processing in a manner that is both robust and aligned with modern Laravel architecture.

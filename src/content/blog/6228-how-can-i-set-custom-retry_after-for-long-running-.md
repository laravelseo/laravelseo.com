---
title: "How can i set custom retry_after for long running jobs | laravel"
description: "How Can I Set Custom retry after for Long Running Jobs | Laravel As developers working with asynchronous processing in Laravel, we frequently encounter the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with asynchronous processing in Laravel, we frequently encounter the challenge of managing long-running jobs. When a task spans several hours, relying solely on the default retry mechanisms can lead to frustrating scenarios: excessive retries, duplicate data creation, and unnecessary resource consumption. The core issue often lies in how the queue driver (like Redis via Horizon) handles these automatic delays.

This post dives deep into why the standard `retry_after` setting might not suffice for marathon jobs and provides practical strategies for implementing custom backoff policies to ensure data integrity and stable job execution, drawing upon best practices in Laravel development.

## The Problem with Default Retry Logic on Long Jobs

You are running a job that takes up to three hours. When this job fails or times out, the queue system attempts to reschedule it based on configured settings (like `retry_after`). In your scenario, increasing the `$timeout` on the job itself is a band-aid solution that causes data duplication because the retry mechanism attempts to re-run the work too quickly after the initial failure, leading to race conditions or duplicate database entries.

The default behavior aims for quick recovery, which is perfect for short tasks, but detrimental for long operations where you need a deliberate, extended pause before attempting a retry. We need a mechanism that allows us to define a much longer delay specifically for jobs of this magnitude.

## Strategy: Implementing Custom Backoff for Long-Running Tasks

Since the built-in queue configuration often applies globally or at the connection level, the most robust way to manage custom delays is to implement **manual backoff** within the job handler itself, combined with careful management of job state.

Instead of trying to manipulate the queue driver's internal `retry_after` setting directly for every long job (which can be inconsistent across different queue setups), we control the flow internally.

### 1. Using Job Properties for Extended Timeout

First, ensure your job explicitly defines its expected maximum runtime using the `$timeout` property, as you have done:

```php
class UploadCsvDataInTable extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels, Dispatchable, Queueable;

    // Set a very long timeout (e.g., 24 hours) to signal its expected duration
    public $timeout = 86400; // 24 hours in seconds

    // ... rest of the class
}
```

While this doesn't stop the queue from retrying, it sets a clear expectation for monitoring tools like Horizon.

### 2. Implementing Conditional Retries with Custom Delays

For truly long jobs, we need to detect if the job is attempting a retry and introduce an exponential or linear delay that exceeds the default queue settings. This is often achieved by checking the attempt count provided by Laravel's `ShouldBeUnique` or by using custom logic within the `handle()` method.

A more direct approach for controlling delays between attempts involves leveraging the `$tries` setting in your queue configuration and explicitly pausing execution if a retry is detected.

If you are using Horizon, excellent monitoring tools allow you to view job history and manually manage retries. However, for programmatic control over long waits, we can use Laravel's built-in `release()` method combined with `delay()`:

```php
public function handle()
{
    // Example: Check if this is a retry attempt (this requires tracking state, often via metadata or the job's attempts property)
    if ($this->attempts() > 1) {
        // If it's a retry, introduce a massive delay before re-processing.
        $delaySeconds = 60 * 60 * 24; // Wait 24 hours before retrying
        
        // Release the job back onto the queue with the extended delay
        $this->release($delaySeconds);

        // Log this action for auditing purposes
        \Log::warning("Job " . $this->job->getJobId() . " is retrying after a 24-hour pause.");
        
        return; // Stop execution of the main task immediately
    }

    // Original long-running logic executes only on the first attempt
    app(CsvUploadService::class)->uploadCsv($this->csvUpload);
}
```

This approach bypasses relying solely on the queue driver's `retry_after` setting. Instead, you are explicitly telling Laravel: "I know this job is long; if it fails and needs a retry, wait 24 hours before attempting it again." This gives you absolute control over your data integrity and prevents the system from churning through identical work repeatedly.

## Conclusion

Managing long-running jobs requires moving beyond simple queue configuration settings. While Laravel provides powerful tools for asynchronous work, ensuring data consistency for multi-hour operations demands custom logic. By implementing explicit backoff strategies within the job handler—using properties like `$timeout` and conditionally calling `$this->release($delay)`—you gain the necessary control to set custom, deliberate delays between retries. This ensures that your queue system, leveraged by tools like Horizon, operates predictably, preventing duplicate entries and ensuring robust data management across complex workflows. For more advanced insights into scaling these operations, exploring resources from [laravelcompany.com](https://laravelcompany.com) is highly recommended.

---
title: "How to delete some records or files after X time - Laravel 5"
description: "How to Implement Time Based Record and File Deletion in Laravel: A Performance Focused Approach As developers, we often face the challenge of managing data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

As developers, we often face the challenge of managing data lifecycle—whether it's old records or stale uploaded files. The desire to automatically clean up these resources after a certain time (e.g., deleting records older than 2 hours or files older than 5 days) is valid for database hygiene and storage management. However, as you rightly pointed out, performing massive deletion operations synchronously during a user request can severely degrade site performance.

The key to solving this lies in *asynchronous processing* and using Laravel's built-in scheduling capabilities rather than running heavy scripts immediately.

## The Foundation: Soft Deleting vs. Hard Deleting

Before diving into the "how," we must decide on the deletion strategy. For applications where data history might be important, **soft deleting** is often superior to hard deletion.

**Soft Deleting:** Instead of physically removing a record from the database, you add a timestamp (like `deleted_at` in an Eloquent model) or a status flag (`is_deleted = true`). This keeps the data accessible for auditing and recovery while logically hiding it from public views. You only perform the actual physical deletion later during a cleanup job.

**Hard Deleting:** Physically removing the record and deleting the associated files/storage entries immediately. While simple, this is risky if not executed in a controlled background process, as it can lock up resources or fail mid-operation.

## Strategy 1: Scheduling Database Record Cleanup

For deleting records based on age (e.g., records older than X time), the best practice in Laravel is to leverage the **Task Scheduling** feature. This ensures that heavy database queries run periodically in the background, keeping your web requests fast and responsive.

### Implementing Scheduled Deletion

You will use the Laravel Scheduler (`php artisan schedule:run`) combined with custom Artisan commands or scheduled jobs.

1.  **Define a Cleanup Job:** Create a dedicated class for handling the deletion logic.
2.  **Schedule the Job:** Tell the scheduler when to run this job.

Here is a conceptual example of how you would structure the scheduling, focusing on records older than 2 hours:

```php
// app/Console/Commands/CleanupOldRecords.php

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CleanupOldRecords extends Command
{
    protected $signature = 'cleanup:old-records';
    protected $description = 'Deletes records older than 2 hours.';

    public function handle()
    {
        $cutoffTime = Carbon::now()->subHours(2);

        // Example: Soft delete records older than the cutoff time
        $deletedCount = DB::table('your_table_name')
            ->where('created_at', '<', $cutoffTime)
            ->update(['deleted_at' => Carbon::now()]);

        $this->info("Successfully soft-deleted {$deletedCount} records older than 2 hours.");
    }
}
```

You would then add this command to your `app/Console/Kernel.php` file to run it every hour or every night:

```php
// app/Console/Kernel.php

protected function schedule(Schedule $schedule)
{
    $schedule->command('cleanup:old-records')->hourly();
}
```

This approach keeps the intensive database operation off the user's request cycle, which is crucial for maintaining performance, aligning with best practices discussed by teams leveraging frameworks like **Laravel Company**.

## Strategy 2: Managing File Storage Deletion

Deleting files from storage requires a slightly different, but equally asynchronous, strategy. Since you are dealing with file paths and database records, the process should be handled in a reliable background queue.

1.  **Identify Targets:** Run a scheduled job that queries your `files` table for records where the expiration date has passed (e.g., older than 5 days).
2.  **Process Asynchronously:** Instead of deleting the file directly within the scheduler, dispatch a dedicated job to handle the file system operations. This prevents the schedule from timing out if the storage operation is slow.

```php
// Example Job for File Deletion
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class FileCleanupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $fileRecord;

    public function __construct($fileRecord)
    {
        $this->fileRecord = $fileRecord;
    }

    public function handle()
    {
        // 1. Verify the file still exists (optional but recommended)
        if (!Storage::disk('public')->exists($this->fileRecord->path)) {
            return; // File already gone
        }

        // 2. Delete the physical file from storage
        Storage::disk('public')->delete($this->fileRecord->path);

        // 3. Soft delete the database record
        $this->fileRecord->delete();
    }
}
```

When you run your scheduler, it would dispatch these jobs to the queue. Workers then process these jobs in the background, ensuring that file deletion and database updates do not block the user experience.

## Conclusion

Managing data lifecycle efficiently requires moving away from synchronous operations. By adopting a strategy based on **soft deleting** for data and utilizing **Laravel Task Scheduling** combined with **Queues** for file system management, you can achieve comprehensive record and file cleanup without negatively impacting your application's speed. This methodical, asynchronous approach is the hallmark of building scalable and high-performing applications in Laravel.

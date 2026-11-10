---
title: "How to run only one job at time in same laravel queue?"
description: "Master the Concurrency: How to Run Only One Job at a Time in the Same Laravel Queue As developers building SaaS applications, managing concurrency is not..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers building SaaS applications, managing concurrency is not just a feature—it's a critical requirement for maintaining data integrity and respecting external API rate limits. When you queue jobs based on user-specific operations, ensuring that an individual user only executes one sensitive operation at a time becomes paramount.

This post dives into a common challenge: how to enforce a "single job at a time" policy per user within a shared Laravel queue system, especially when using Redis for backend storage. We will look at your specific scenario involving API calls and user-specific limits.

## The Challenge: Ensuring Per-User Exclusivity

You are using the `OnQueue($user->name)` mechanism to route jobs, which correctly separates tasks into different queues based on the user identifier. However, the standard Laravel queue workers process messages independently. If multiple workers pick up jobs for the same user simultaneously, they will execute the potentially rate-limited API calls concurrently, leading to conflicts or exceeding your service limits.

The goal is to implement a distributed lock mechanism that guarantees exclusivity for each user ID across all running queue workers.

## The Solution: Implementing Distributed Locking with Redis

Since you are already leveraging Redis, which provides atomic operations necessary for locking, we can use it to establish a lock before processing the job. This prevents any other worker from attempting to process the same user’s job concurrently.

The core strategy involves using Redis's `SETNX` (Set if Not eXists) command or Laravel's built-in cache mechanism to set an exclusive lock keyed by the user ID *before* the job execution begins, and ensuring it is released upon completion or failure.

### Step 1: Modifying the Job Execution Flow

Instead of just dispatching the job via `OnQueue`, we need to introduce a locking layer within the job handler itself.

In your current setup, where you dispatch jobs like this:
```php
foreach ($accounts as $acc) {
    doFollowing::dispatch($acc)->onQueue($acc->login);
}
```
The lock mechanism must be implemented inside the `handle()` method of your job class to ensure that only one process is actively working on that specific user's context.

### Step 2: Implementing the Lock in the Job Class

We will use Laravel’s cache facade (which backs Redis) to manage the locks. We set a lock key associated with the user ID, setting an expiration time (TTL) to prevent permanent deadlocks if a worker crashes.

Here is how you can modify your job class to incorporate this locking logic:

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Queue\SerializesModels;
// ... other necessary imports

class YourJob implements ShouldQueue
{
    use SerializesModels;

    protected $acc;
    protected $ownjob;

    public function __construct(Accounts $acc)
    {
        $this->acc = $acc;
        $this->ownjob = $acc->prepareJobQueue();
    }

    public function handle()
    {
        $userId = $this->acc->login;
        $lockKey = "user_job_lock:{$userId}";
        $lockTimeout = 60; // Lock expires after 60 seconds (adjust based on expected job time)

        // Attempt to acquire the lock using Redis/Cache
        if (! Cache::lock($lockKey, $lockTimeout)) {
            info("User {$userId}: Could not acquire lock. Job skipped.");
            return; // Another worker is already handling this user's job. Stop execution.
        }

        try {
            // --- Critical Section: Only one process can be here at a time ---
            info("User {$userId}: Lock acquired. Starting API operations.");

            $api = new Api([
                'login'     => $this->acc->login,
                'password'  => $this->acc->password,
            ]);

            if ($api->checkLogin()) {
                info("{$this->acc->login} OK Authorized");
                foreach ($this->ownjob['queue'] as $term) {
                    switch($term['type']) {
                        case 'hashtag':
                            // ... your existing logic ...
                            $hashtag = Hashtags::where('cha_name',$term['value'])-->first();
                            $answer = $api->getUsersByHashtag($hashtag,50);
                            break;
                        case 'concurency':
                            // ... your existing logic ...
                            $soc_user = Users::where('soc_unique_id',$term['value'])-->first();
                            $answer = $api->getUserFollowers($soc_user);
                            break;
                        default:
                            break;
                    }
                }
            } else {
                info("{$this->acc->login} NOT Authorized - STOP JOB");
            }
            // --- End Critical Section ---

        } catch (\Exception $e) {
            // Handle exceptions gracefully
            info("Error processing job for {$userId}: " . $e->getMessage());
        } finally {
            // IMPORTANT: Release the lock, regardless of success or failure!
            Cache::lock($lockKey)->release();
            info("User {$userId}: Lock released.");
        }
    }
}
```

## Best Practices for Queue Locking

1.  **Use Atomic Operations:** Always rely on Redis-backed operations (like those provided by `Cache` or dedicated queue libraries) for locking, as these are atomic and prevent race conditions.
2.  **Set a Time-To-Live (TTL):** Never let a lock be permanent. Setting an expiration time (`$lockTimeout`) ensures that if a worker crashes mid-job, the lock will eventually expire, allowing another job to run later.
3.  **The `finally` Block is Non-Negotiable:** The most critical step is releasing the lock within a `finally` block. This guarantees that even if your API calls throw an exception, the lock is released, preventing jobs from getting permanently stuck in a locked state.

## Conclusion

By integrating a distributed locking pattern using Redis into your Laravel queue jobs, you successfully elevate your system's concurrency management. You move beyond simple queue routing (`OnQueue`) to implementing robust business logic controls, ensuring that sensitive operations tied to specific user accounts adhere strictly to single-execution policies. This approach aligns perfectly with the principles of building scalable and reliable services, much like the architectural focus seen in projects on [laravelcompany.com](https://laravelcompany.com).

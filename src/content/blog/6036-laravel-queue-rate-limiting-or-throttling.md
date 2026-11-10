---
title: "Laravel queue rate limiting or throttling"
description: "Mastering External API Rate Limits: Throttling Laravel Queues for Third Party Services Working with external APIs that impose strict rate limits is a very..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Working with external APIs that impose strict rate limits is a very common challenge in modern application development. When you move these external calls into a queue system like Laravel, you introduce a layer of abstraction, but the underlying constraint—the third-party server’s limit (e.g., 1 request per second)—still needs to be managed.

You are right to question where standard Laravel Rate Limiting fits in here. The confusion arises because Laravel's built-in rate limiting is primarily designed to protect your *application* from excessive internal requests (like hitting an endpoint too often) rather than managing the flow of external, time-sensitive operations executed by background jobs.

Let’s dive into why this is tricky and how senior developers typically approach throttling external API calls within a Laravel queue environment.

## The Bottleneck: Application Rate vs. External Rate

The core issue here is distinguishing between two types of rate limiting:

1.  **Application Rate Limiting:** Controlling how many jobs are dispatched or processed *within* your Laravel application (e.g., ensuring a user cannot submit 100 requests per minute). This is where Laravel's built-in `RateLimiter` middleware shines.
2.  **External API Rate Limiting:** Controlling the frequency of calls made to an external service by your workers. This limit is imposed by the third party and must be respected by *your* system to avoid being blocked or incurring penalties.

If you simply use Laravel rate limiting on the queue itself, it won't solve the problem because the bottleneck isn't how fast your workers run; it’s how fast the external server responds.

## The Solution: Throttling Inside the Job

Since the constraint is external, the most reliable solution is to implement throttling directly within the job execution logic itself. This ensures that even if multiple jobs are waiting in the queue, only one attempts the external API call at a time, respecting the 1-second window.

### Implementation Strategy: Introducing Delays

The simplest (though sometimes inefficient) method is using `sleep()`. However, relying solely on `sleep()` can lead to poor performance as it introduces idle time waiting for a fixed duration. A more robust approach involves managing state or using dedicated queue strategies.

Here is an example of how you would structure a job to respect a one-second limit:

```php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Http;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ThirdPartyApiJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // --- Throttling Logic ---
        // In a high-concurrency environment, you would use Redis or a shared cache 
        // to implement a distributed lock/semaphore to ensure only one process accesses the API at a time.
        
        // For this simple demonstration, we enforce a minimum delay.
        $this->throttleRequest();

        // --- Actual External Call ---
        try {
            $response = Http::withToken('your_api_key')
                         ->post('https://external-service.com/data', $this->data);
            
            if ($response->successful()) {
                \Log::info('Successfully fetched data via external API.');
            } else {
                \Log::error('External API call failed: ' . $response->status());
            }
        } catch (\Exception $e) {
            \Log::error('Error during API call: ' . $e->getMessage());
        }
    }

    /**
     * Enforce the one-request-per-second rule.
     */
    protected function throttleRequest(): void
    {
        // For a strict 1 request per second limit, we calculate the time elapsed since the last call.
        $lastCallTime = \Cache::get('api_throttle_time', 0);
        $currentTime = \Carbon\Carbon::now()->timestamp;

        // Calculate the required sleep time to adhere to the 1-second window.
        $sleepTime = max(0, (int)($lastCallTime + 1000) - $currentTime);

        if ($sleepTime > 0) {
            \Log::info("Throttling request. Sleeping for {$sleepTime} seconds.");
            sleep($sleepTime);
        }

        // Update the last call time in the cache for the next job.
        \Cache::put('api_throttle_time', $currentTime, 60 * 60); // Cache for an hour
    }
}
```

## Advanced Consideration: Distributed Locking

The `sleep()` method above is simple but flawed in a highly distributed environment (multiple queue workers running simultaneously). If two jobs execute this logic at the same time, they might both calculate their sleep time and violate the external rate limit.

For true robustness, you need **distributed locking**. This means using Redis or a similar mechanism to acquire a lock before executing the API call. Only the worker that successfully acquires the lock proceeds with the request, ensuring only one process touches the external service at any given moment. This pattern is crucial when dealing with rate limits across multiple workers, as recommended by best practices seen in scalable Laravel applications like those on **laravelcompany.com**.

## Conclusion

To summarize, do not rely solely on Laravel's queue rate limiting to manage external API constraints. Instead, treat the external limit as a hard constraint that must be enforced within your job execution logic. For critical throttling, implement distributed locking using Redis to ensure that even when running parallel workers, you never exceed the third-party server's request frequency. This approach provides both application control and external compliance.

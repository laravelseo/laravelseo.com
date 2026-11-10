---
title: "Best Practice for Laravel Asynchronous Requests"
description: "Mastering Asynchronous Requests in Laravel: Solving Controller Latency Bottlenecks As a senior developer, I often see this exact scenario arise when building..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

As a senior developer, I often see this exact scenario arise when building modern web applications with frameworks like Laravel: the initial performance is fine for small data fetches, but as you scale up to hundreds of external API calls within a single request cycle, latency spikes dramatically. You are experiencing the classic bottleneck of synchronous I/O operations blocking your application thread.

The problem you described—where 3-10 API calls are fast, but 200 calls cause severe latency when executed synchronously in a controller—is not a flaw in Laravel itself, but rather a limitation of how traditional MVC request handling processes slow, external network waits. Since the PHP process must wait for every outbound HTTP request to complete before it can render the final response, performance suffers significantly.

This post will dive into why this happens and present the definitive best practice for handling high volumes of asynchronous tasks in Laravel: **Queues**.

---

## Understanding Synchronous vs. Asynchronous I/O

In a standard Laravel request cycle, when your controller loops through 200 API calls, it executes them sequentially. The PHP thread sits idle, waiting for the response from the external service for each call before moving to the next one. This serial waiting process compounds quickly, leading to high perceived latency for the end-user.

While exploring options like PHP cURL Async or Promises are technically valid ways to handle concurrency within a single script execution, they introduce significant complexity in managing state, error handling, and thread management directly within the HTTP request lifecycle.

The superior architectural approach in the Laravel ecosystem is **decoupling** the slow work from the immediate user request using Queues.

## The Laravel Solution: Leveraging Queues for Background Processing

Laravel Queues provide a robust, scalable mechanism to handle tasks that do not need to be completed instantly during the HTTP request. Instead of blocking the user while waiting for 200 external API calls, you offload each API call into a separate background job.

When a request hits your controller:
1. The controller quickly pushes 200 jobs onto the queue (e.g., `FetchDataJob`).
2. The controller immediately returns a response to the user ("Processing started").
3. A separate worker process (running via `php artisan queue:work`) picks up these jobs from the queue and executes the slow external API calls in the background, completely decoupled from the web request thread.

This separation ensures your web application remains fast and responsive, while the heavy lifting is handled efficiently by dedicated workers. This aligns perfectly with the principles of building scalable systems, which is a core focus when developing robust applications on platforms like those offered by [laravelcompany.com](https://laravelcompany.com).

### Practical Implementation Example

Here is a simplified example demonstrating how you would structure this asynchronous flow:

**1. Create the Job:** Define a job that encapsulates the logic for fetching a single API endpoint.

```php
// app/Jobs/FetchExternalData.php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class FetchExternalData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $apiUrl;
    protected $requestId;

    public function __construct(string $apiUrl, string $requestId)
    {
        $this->apiUrl = $apiUrl;
        $this->requestId = $requestId;
    }

    /**
     * Execute the job. This is where the slow work happens.
     */
    public function handle()
    {
        // Simulate an actual, slow API call (e.g., using Guzzle)
        sleep(2); 
        
        // Log or store the result in the database instead of returning it immediately
        \Log::info("Successfully fetched data for request ID: " . $this->requestId . " from URL: " . $this->apiUrl);

        // You would typically save this result to a database table here.
    }
}
```

**2. Dispatch the Jobs from the Controller:** The controller now becomes extremely fast, simply dispatching the work.

```php
// app/Http/Controllers/DataController.php
namespace App\Http\Controllers;

use App\Jobs\FetchExternalData;
use Illuminate\Http\Request;

class DataController extends Controller
{
    public function index(Request $request)
    {
        $jobs = [];
        // Loop to create 200 jobs instead of waiting for them
        for ($i = 1; $i <= 200; $i++) {
            $apiUrl = "https://api.example.com/data/$i";
            // Dispatch the job asynchronously
            $jobs[] = new FetchExternalData($apiUrl, (string)$i);
        }

        // Dispatch all jobs to the queue in one go
        foreach ($jobs as $job) {
            $job->dispatch();
        }

        return response()->json(['message' => 'Requests dispatched to background processing.']);
    }
}
```

**3. Running the Workers:** Finally, you start your queue worker in a separate terminal session:

```bash
php artisan queue:work
```

## Conclusion

When dealing with I/O-bound operations like making numerous external API calls, relying on synchronous execution within an HTTP request is a recipe for poor performance and high latency. While low-level asynchronous techniques exist, the most practical, maintainable, and scalable solution in the Laravel world is to adopt **Laravel Queues**. By offloading these tasks to background workers, you ensure your application remains highly responsive while guaranteeing that all necessary external data is eventually fetched and processed reliably. This architectural shift is fundamental to building high-performance services on Laravel.

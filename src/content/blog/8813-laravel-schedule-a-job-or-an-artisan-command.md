---
title: "Laravel: Schedule a job or an artisan command?"
description: "Laravel: Schedule a Job or an Artisan Command? Deciding on the Right Background Processing Strategy As senior developers working with Laravel, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As senior developers working with Laravel, we frequently encounter the need to execute repetitive tasks—fetching external data, sending emails, performing complex calculations—on a regular schedule. When faced with this requirement, two primary tools emerge from the Laravel ecosystem: Artisan Commands and Queued Jobs, both of which can be scheduled using the built-in scheduler.

For scenarios like yours—where you need to fetch an external API price every minute to update a database record—the choice between these two methods is critical for reliability, scalability, and maintainability. Let’s dissect the options and determine the optimal approach for your specific use case.

---

## Understanding the Tools: Commands vs. Jobs

Both Artisan commands and Queued Jobs are mechanisms Laravel provides for executing code outside of an immediate HTTP request cycle. However, they serve fundamentally different purposes.

### Artisan Commands
Artisan commands are essentially custom CLI tools. They are excellent for performing discrete, often one-off operations or complex, self-contained logic that you might run manually or via a system cron job.

*   **Pros:** Simple to implement for standalone tasks; easy to define custom console logic.
*   **Cons:** Lacks built-in mechanisms for handling failures, retries, or managing long-running processes asynchronously away from the web request flow.

### Queued Jobs
Queued Jobs leverage Laravel’s queue system (using drivers like Redis, Beanstalkd, or database) to process tasks asynchronously in the background. This decouples the task execution from the triggering event.

*   **Pros:** Superior reliability; built-in retry mechanisms; handles long-running processes gracefully; essential for scaling applications and preventing web request timeouts.
*   **Cons:** Requires setting up a queue driver and managing workers.

---

## The Optimal Approach for Scheduled Updates

For your requirement—fetching an external price every minute to update the `Product` table—the **Queued Job approach is significantly better and the recommended path.**

### Why Queued Jobs Win for External API Fetching

When dealing with external API calls, there are inherent risks: network latency spikes, rate limiting errors from the external service, or temporary connection failures. If you run this fetching logic directly inside a scheduled Artisan command that is triggered by `schedule`, and the job takes longer than expected, it can lead to unpredictable behavior or timeouts if not managed correctly.

1.  **Reliability and Retries:** Queue Jobs allow you to implement robust error handling. If the API call fails due to a temporary network issue, the queue system can automatically retry the job later, ensuring your price data eventually updates without manual intervention.
2.  **Decoupling:** The scheduler only needs to know *that* a job needs to be placed on the queue; it doesn't need to worry about *how* the work is executed. This separation makes your system cleaner and more scalable.
3.  **Scalability:** If load increases, you can scale your queue workers independently of your web servers. This aligns perfectly with modern application architecture principles, much like the design philosophy promoted by organizations like the Laravel team at https://laravelcompany.com.

### Implementation Example: The Job Strategy

Instead of relying solely on the scheduler to execute complex logic directly, we use the scheduler to dispatch jobs that handle the actual work.

**Step 1: Create the Job**
We create a job responsible for fetching and updating the price.

```php
// app/Jobs/UpdateProductPrice.php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Product; // Assuming you use Eloquent models

class UpdateProductPrice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $productId;

    /**
     * Create a new job instance.
     *
     * @param int $productId
     */
    public function __construct(int $productId)
    {
        $this->productId = $productId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // 1. Fetch the external price (simulated API call)
        $externalPrice = $this->fetchPriceFromApi($this->productId);

        if ($externalPrice !== null) {
            // 2. Update the database record using Eloquent
            $product = Product::findOrFail($this->productId);
            $product->price = $externalPrice;
            $product->save();
            \Log::info("Product ID {$this->productId} price updated successfully.");
        } else {
            \Log::error("Failed to fetch price for Product ID {$this->productId}.");
            // Throwing an exception here will trigger the queue retry mechanism.
            throw new \Exception("API Fetch Failed.");
        }
    }

    protected function fetchPriceFromApi(int $id): ?float
    {
        // Placeholder for actual Guzzle/HTTP request logic
        // In a real application, this is where you handle API communication.
        return rand(1000, 5000); 
    }
}
```

**Step 2: Schedule the Dispatch**
Instead of scheduling the job directly in the `schedule` command to run every minute (which often gets complicated with precise timing), a more robust pattern is to schedule a simple runner that checks and dispatches jobs.

If you strictly need "every minute," you would use the standard Laravel scheduler to trigger a command, and that command’s only job is to dispatch the necessary work:

```php
// App/Console/Commands/SyncPrices.php

class SyncPrices extends Command
{
    protected $signature = 'sync:prices';
    protected $description = 'Triggers the price synchronization jobs.';

    public function handle()
    {
        // Find all products that need an update and dispatch a job for each one.
        Product::where('needs_update', true)->get()->each(function ($product) {
            UpdateProductPrice::dispatch($product->id);
        });

        $this->info('Scheduled price synchronization jobs dispatched.');
    }
}
```
You would then set up your cron job to run `php artisan sync:prices` every minute.

---

## Conclusion

When scheduling tasks in Laravel, always prioritize **asynchronous processing and reliability**. While Artisan commands are perfect for one-off CLI scripts, complex background synchronization involving external dependencies is the domain of **Queued Jobs**. By leveraging queues, you ensure that your scheduled updates are not only executed but are also resilient to transient errors, making your application robust, scalable, and easy to maintain. Embrace the power of the queue system to build truly dependable systems, just as strong applications should be.

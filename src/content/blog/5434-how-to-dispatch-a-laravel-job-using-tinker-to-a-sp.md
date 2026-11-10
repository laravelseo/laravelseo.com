---
title: "How to dispatch a Laravel job using tinker to a specific queue?"
description: "How to Dispatch a Laravel Job to a Specific Queue Using Tinker Trying to master Laravel queues, especially when dealing with different processing priorities..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Trying to master Laravel queues, especially when dealing with different processing priorities like 'default' versus a dedicated 'long-running-queue', is a common challenge in production environments. Managing these queues effectively, often through tools like Horizon and Redis, is crucial for ensuring reliable background processing.

If you are looking to dispatch jobs from the Tinker console (`php artisan tinker`) and direct them to a specific queue, you've encountered a very specific error. This post will diagnose why your attempt failed and provide the correct, robust methods for managing Laravel queues.

## Diagnosing the Error: Why `onQueue()` Fails

The error message you received—`Call to a member function onQueue() on string in /home/mywebappeval()'d code on line 1`—tells us exactly what went wrong. It means that the object you were calling `onQueue()` on was a **string**, not an object that possesses that method.

When you use commands like `Bus::dispatch(...)`, Laravel's internal mechanism handles the queuing process. The issue arises because the direct chaining of methods in Tinker, as shown:

```php
Bus::dispatch(new \App\Jobs\MyJob('MyArg'))->onQueue('long-running-queue')
```

is not the intended or supported syntax for specifying the queue during a standard dispatch operation in this manner. The `Bus` facade handles the initial dispatch, and subsequent methods are often designed to operate on the resulting event or job instance, but the way you were chaining it was confusing the dispatcher into treating the result as a string rather than an object capable of queue manipulation.

## The Correct Way to Dispatch Jobs to Specific Queues

There are several reliable ways to ensure your jobs land in the desired queue. The best approach depends on whether you want to configure the queue globally, within the job class itself, or dynamically during dispatching.

### Method 1: Setting the Queue on the Job Class (The Best Practice)

The most professional and maintainable way to handle queues is to define the intended queue directly within your Job class. This ensures that no matter where the job is dispatched from—whether via Artisan, Tinker, or an API—it inherently knows which queue it belongs to.

In your `app/Jobs/MyJob.php` file, you use the `queue` property:

```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class MyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    /**
     * The queue name this job should be dispatched to.
     *
     * @var string
     */
    public $queue = 'default'; // Set the default queue here

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($arg)
    {
        // Initialization logic
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function run()
    {
        // Job execution logic
    }
}
```

Once you set this property, dispatching becomes straightforward and queue-specific:

**In Tinker:**

```php
use App\Jobs\MyJob;

// Dispatching directly targets the queue defined in the class
Bus::dispatch(new MyJob('MyArg'));
```

### Method 2: Dynamic Queue Selection via Closure (Advanced)

If you absolutely need to select the queue dynamically at runtime, you can pass the queue as an argument or use a closure with `dispatch`. This keeps the dispatch action clean and avoids complex method chaining that caused your original error.

For example, if you are dispatching a job that needs to run on a specific queue:

```php
use App\Jobs\MyJob;

// Dispatching using a closure to specify the queue context
Bus::dispatch(new MyJob('MyArg'))->onQueue('long-running-queue'); 
// Note: While this syntax caused the error previously, ensure you are calling it correctly. 
// In modern Laravel versions, ensuring the job object itself is valid resolves internal type issues.
```

If Method 1 (setting the queue on the Job class) proves too restrictive for your workflow, consider using custom queue dispatchers or service classes to abstract this logic away from Tinker and into a more structured layer—a key principle when building complex services in Laravel, as discussed in advanced topics related to application architecture.

## Conclusion

The failure you encountered was due to an incorrect method invocation syntax within the Artisan/Tinker environment. For robust queue management in Laravel, always favor **Method 1**: defining the intended queue directly on the Job class. This makes your code self-documenting, inherently reliable, and prevents runtime errors when dispatching jobs across different queues, whether you are using Redis or any other configured driver. By adhering to these principles, you ensure that your background processing scales reliably, aligning perfectly with the architectural standards promoted by the Laravel team at https://laravelcompany.com.

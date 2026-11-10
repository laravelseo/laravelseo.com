---
title: "Laravel 5: Performing an asynchronous task"
description: "Laravel Asynchronicity: Performing Heavy Image Processing Without Timeouts As a senior developer working with Laravel, we constantly face performance..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

As a senior developer working with Laravel, we constantly face performance bottlenecks. A very common scenario, especially when dealing with file uploads and heavy media processing like image manipulation, is the problem you described: running time-consuming operations synchronously within an HTTP request leads to frustrating timeouts for the end-user.

When your code involves intensive tasks—such as resizing large images using libraries like Intervention Image—it’s crucial to move that work off the main request thread. If you don't, your application will feel sluggish or outright fail under load. The Laravel way to solve this is by leveraging its powerful **Queues** and **Jobs** system.

This post will walk you through the architectural pattern for performing asynchronous tasks in Laravel, specifically applying it to your image processing example.

---

## The Problem with Synchronous Processing

Your current implementation executes all the `Intervention\Image` commands directly within the controller method:

```php
public function storeSnapshots(UploadedFile $image) {
    // ... file naming ...
    \Intervention\Image\Facades\Image::make($image)
        ->heighten(2000, function($constraint) {
            $constraint->upsize();
        })->save('img/lg/' . $imageName)
        // ... more operations ...
    return $imageName;
}
```

Because image processing is CPU-bound and can take several seconds, forcing the web server to wait for this entire chain to complete causes the request to time out. The user gets a 500 error or a stalled page, even though the work is technically being done.

## The Laravel Solution: Queues and Jobs

The solution is simple: delegate the heavy lifting to a background worker managed by a queue system. Laravel provides a robust abstraction for this via **Jobs**. A Job is essentially a class that encapsulates a specific task, making it easy for the queue system (like Redis or Beanstalkd) to handle the execution later.

### Step 1: Create the Job Class

First, we create a dedicated Job class responsible only for the image processing logic. This keeps your controller clean and separates concerns effectively.

```php
// app/Jobs/ProcessImageSnapshot.php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;

class ProcessImageSnapshot implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $imagePath;
    protected $imageName;

    /**
     * Create a new job instance.
     *
     * @param string $path The path to the uploaded file.
     * @param string $name The desired unique filename.
     */
    public function __construct(string $path, string $name)
    {
        $this->imagePath = $path;
        $this->imageName = $name;
    }

    /**
     * Execute the job. This runs in the background worker.
     */
    public function handle()
    {
        // Perform the heavy, time-consuming processing here.
        \Intervention\Image\Facades\Image::make($this->imagePath)
            ->heighten(2000, function ($constraint) {
                $constraint->upsize();
            })->save('img/lg/' . $this->imageName);

        \Intervention\Image\Facades\Image::make($this->imagePath)
            ->heighten(800)->save('img/md/' . $this->imageName);

        \Intervention\Image\

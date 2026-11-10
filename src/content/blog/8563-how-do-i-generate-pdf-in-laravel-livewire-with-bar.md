---
title: "How do I generate PDF in Laravel Livewire with `barryvdh/laravel-dompdf`?"
description: "How to Generate PDFs in Laravel Livewire with barryvdh/laravel dompdf: Solving the Timeout Mystery As a senior developer working with modern PHP frameworks..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

As a senior developer working with modern PHP frameworks like Laravel, we often run into performance bottlenecks when dealing with heavy operations, such as PDF generation. When integrating libraries like `barryvdh/laravel-dompdf` within interactive systems like Livewire, it’s not uncommon to encounter execution time limits, resulting in frustrating "Maximum execution time exceeded" errors.

This post will diagnose why this happens and provide robust, production-ready solutions for generating PDFs efficiently in your Laravel Livewire application.

## The Root Cause: Why Does the Timeout Occur?

The issue you are facing—the 60-second timeout—is typically not a bug in `laravel-dompdf` itself, but rather a limitation imposed by PHP's execution environment when running synchronous operations via an HTTP request.

When you click the "Generate PDF" button in your Livewire component, the entire process (loading the Blade view, rendering it, and then processing the PDF generation using DomPDF) must complete within the server's configured `max_execution_time`. If the template is complex, involves many loops, or requires significant memory allocation during the PDF rendering phase, the process easily exceeds this limit.

In your provided code snippet:

```php
public function generatePdf(): Response
{
    $pdf = PDF::loadView('livewire.report-card-generator')->setPaper('A4');
    return $pdf->stream('report.pdf');
}
```

This synchronous call forces the web request to wait for potentially lengthy file generation, causing it to time out before the stream can be fully delivered.

## Solution 1: Immediate Debugging and Environment Checks

Before moving to asynchronous solutions, let's ensure your environment is optimized. If you must perform this synchronously (for very simple reports), you can try increasing the limits in your `.env` file or within your application bootstrap file:

```php
// In your app/Providers/AppServiceProvider.php or a custom service provider
if (config('app.env') !== 'local') {
    ini_set('max_execution_time', 120); // Increase execution time to 120 seconds
    ini_set('memory_limit', '512M');    // Increase memory limit
}
```

While this addresses the symptom, it is generally considered poor practice for high-traffic applications because it forces every request to consume more resources unnecessarily. We should aim for a more scalable approach, especially when building robust systems on the Laravel platform.

## Solution 2: The Scalable Approach – Asynchronous PDF Generation (Recommended)

For any operation that involves heavy processing like PDF generation, the best practice in a modern Laravel application is to move the task off the HTTP request thread and into a background queue using **Laravel Queues**. This allows the user to receive an immediate response while the heavy lifting happens safely in the background.

Here is how you refactor your Livewire action to use queues:

### Step 1: Create a Job

Create a dedicated job that handles the actual PDF generation logic.

```bash
php artisan make:job GeneratePdfJob
```

**app/Jobs/GeneratePdfJob.php:**

```php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class GeneratePdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    protected $viewName;

    public function __construct(string $viewName)
    {
        $this->viewName = $viewName;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // This code runs independently, without HTTP timeout constraints.
        $pdf = Pdf::loadView($this->viewName)->setPaper('A4');
        
        // Instead of streaming directly to the user, save it to storage or send an email.
        // For this example, let's save it to a temporary location or S3 bucket.
        $pdf->save(storage_path('app/reports/' . time() . '.pdf'));

        // Optionally, notify the user (e.g., via WebSocket or storing a status)
    }
}
```

### Step 2: Update the Livewire Component

Modify your Livewire method to dispatch the job instead of executing the PDF logic directly.

**Livewire Component:**

```php
use App\Jobs\GeneratePdfJob;
use Livewire\Component;

class DownloadButton extends Component
{
    public function generatePdf(): void
    {
        // Dispatch the heavy task to the queue
        GeneratePdfJob::dispatch('livewire.report-card-generator');

        // Return an immediate response to the user
        $this->dispatch('pdf_processing_started'); 
    }

    public function render()
    {
        return view('livewire.download-button');
    }
}
```

### Step 3: Run the Queue Worker

Finally, ensure you have a queue worker running on your server to process these jobs:

```bash
php artisan queue:work
```

## Conclusion

Generating PDFs in a Livewire context requires moving beyond simple synchronous execution. While `barryvdh/laravel-dompdf` is excellent for rendering content, relying on it directly within an HTTP request often leads to timeouts. By adopting Laravel's powerful queuing system, as demonstrated above, you transform your application from a brittle, slow process into a scalable, resilient system. This approach ensures that long-running tasks are handled reliably in the background, providing a seamless and fast experience for your end-users. If you are building complex, data-driven applications on the Laravel framework, leveraging these architectural patterns is key to success.

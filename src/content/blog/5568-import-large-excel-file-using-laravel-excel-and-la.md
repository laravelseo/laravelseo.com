---
title: "Import large excel file using laravel excel and laravel queue"
description: "Importing Large Excel Files in Laravel: Mastering Asynchronous Jobs with Laravel Excel and Queues Importing large datasets, such as a 100,000 row Excel file,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Importing large datasets, such as a 100,000-row Excel file, into a database requires more than just running a script. When dealing with heavy processing, the key to maintaining a responsive application is leveraging asynchronous job queues. This guide will walk you through the common pitfalls in setting up file imports using Laravel Excel and Queues, and provide the architectural solution to ensure your data gets imported successfully every time.

## The Challenge: Asynchronous File Import Failure

You have correctly identified the pattern for background processing: handling heavy tasks outside of the HTTP request cycle. You set up a controller to dispatch a job containing the file path, and you successfully capture the entry in your `jobs` table. However, when you run `php artisan queue:work`, the import step fails or is never executed.

This issue almost always stems from how the background worker accesses the uploaded file. When a request is made, files are temporarily stored on the server. The path passed to a queued job might be inaccessible or incorrectly resolved in the worker environment, leading to an error during the `Excel::import()` call.

## The Solution: Robust File Handling for Queue Jobs

The solution lies in ensuring that the file data is persisted in a location accessible by the queue worker and that the job itself handles the file retrieval explicitly, rather than relying solely on a path passed from the controller. We will utilize Laravel's built-in `Storage` facade for reliable file management.

### Step 1: Securely Upload and Store the File

Before dispatching the job, ensure the Excel file is saved to a persistent location within your application's storage system (e.g., the `local` disk).

In your controller, instead of passing the raw file path directly, store the uploaded file using Laravel’s Storage mechanism:

```php
// In your Controller method
use Illuminate\Support\Facades\Storage;

if (request()->file('fertilizer_import')) {
    $file = request()->file('fertilizer_import');
    
    // Store the file securely on the disk
    $path = $file->store('imports', 'local'); 
    
    // Create the job, passing only the path relative to the storage disk
    dispatch(new FertilizerImportJob($path));
}
```

### Step 2: Refine the Job for File Access

Your job should no longer rely on a file path passed from the request. Instead, it should fetch the file directly from the storage system using the stored path. This ensures that the worker process has all the necessary context to read the file, which is a fundamental principle of robust background processing as advocated by the Laravel ecosystem, such as principles found at https://laravelcompany.com.

Update your `FertilizerImportJob.php`:

```php
// app/Jobs/FertilizerImportJob.php

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class FertilizerImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filePath;

    /**
     * Create a new job instance.
     *
     * @param string $filePath The path to the stored Excel file
     */
    public function __construct($filePath)
    {
        $this->filePath = $filePath;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        // Retrieve the file from storage before importing
        $excelFile = Storage::disk('local')->get($this->filePath);

        if (!$excelFile) {
            // Handle the case where the file is missing
            throw new \Exception("Excel file not found at path: " . $this->filePath);
        }

        // Perform the import using laravel-excel
        Excel::import(new \App\Imports\FertilizerImportImport, $excelFile);

        // Optional: Clean up the uploaded file after successful processing
        Storage::disk('local')->delete($this->filePath);
    }
}
```

### Step 3: Define the Import Class

For best practice, define a dedicated import class that handles the mapping between Excel columns and your database schema. This keeps your Job clean and makes the import logic reusable.

```php
// app/Imports/FertilizerImportImport.php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class FertilizerImportImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        // Example: Map Excel columns to database fields
        foreach ($rows as $row) {
            DB::table('fertilizer')->insert([
                'column1' => $row[0], // Adjust indices based on your Excel layout
                'column2' => $row[1],
                // ... other fields
            ]);
        }
    }
}
```

## Conclusion

By shifting the responsibility of file access to the queue job and utilizing Laravel’s Storage system, you create a resilient and decoupled architecture. This approach ensures that your large Excel imports are handled reliably in the background, preventing timeouts and ensuring data integrity. Remember, when building complex systems on Laravel, always focus on how components interact within the framework; leveraging tools like `laravel-excel` alongside robust queuing mechanisms is key to handling high-volume operations efficiently and securely.

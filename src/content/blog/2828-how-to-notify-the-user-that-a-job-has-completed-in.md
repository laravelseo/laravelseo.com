---
title: "How to notify the user that a job has completed in Laravel?"
description: "How to Notify the User That a Job Has Completed in Laravel Working with background processing using Laravel Queues is a cornerstone of building scalable,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Working with background processing using Laravel Queues is a cornerstone of building scalable, responsive web applications. You’ve correctly identified the core challenge: while you can notify the user that a job *started*, notifying them when it *successfully completed* requires bridging the asynchronous gap between the worker process and the synchronous user interface.

This post will walk you through the robust pattern for handling job completion notifications in Laravel, moving beyond simple one-time success responses to create a seamless user experience. We will leverage Laravel’s ecosystem to ensure that status updates are reliable and visible to the end-user.

## The Challenge: Bridging Asynchronous Work with Synchronous UI

As you have demonstrated, initiating a job via an AJAX call is straightforward. When the controller responds successfully, the frontend displays a "Job is being processed" message. The difficulty arises when the actual work happens in the background (via queues) and finishes much later. How does the background worker tell the request that initiated the job that it is done, so the frontend can display "Job completed successfully"?

Relying solely on the initial AJAX response is insufficient because the user leaves the page. We need a persistent mechanism to track the job's state outside of the immediate HTTP request cycle.

## The Solution: Status Tracking and Polling (or Broadcasting)

The most reliable way to handle this is by introducing a centralized status tracking mechanism, usually involving a database or cache. Since background jobs are decoupled from the web request lifecycle, they cannot directly interact with the browser. Therefore, we need a system where the job updates a persistent record, and the frontend periodically checks that record for an update.

### Step 1: Implementing Job Status Tracking

Instead of just dispatching a job, we will introduce a status model or table to track the job's lifecycle (Pending, Processing, Completed, Failed).

In your `Item` model or a dedicated `JobStatus` model, you can store this state. For simplicity, let’s assume you store the status directly on the relevant item record.

### Step 2: Updating the Status within the Job

The core of the solution lies within your job itself. Once the heavy lifting is done, the job must explicitly update the status to 'completed'.

```php
// app/Jobs/MyJob.php

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Item; // Assuming you are updating an Item status

class MyJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    protected $itemId;

    public function __construct(int $itemId)
    {
        $this->itemId = $itemId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $item = Item::findOrFail($this->itemId);

        // --- Perform your heavy processing here

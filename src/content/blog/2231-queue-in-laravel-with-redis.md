---
title: "Queue in laravel with redis"
description: "Title: Efficiently Processing API Calls with Laravel Queues Using Redis Introduction Laravel's queue system is an excellent tool for handling time consuming..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance"]
featured: false
---

Title: Efficiently Processing API Calls with Laravel Queues Using Redis

Introduction

Laravel's queue system is an excellent tool for handling time-consuming or resource-intensive tasks, ensuring your application remains responsive to users and does not get affected by slow processes. In this post, we will explore using Laravel queues with Redis to efficiently process API calls, giving your application a significant performance boost.

Understanding Queues
Laravel's queue system is based on the principle of deferring tasks that are computationally intensive or time-consuming in nature. These tasks are placed into queues, which can be handled by workers either on the same server or remotely. The primary objective is to free up resources and prevent the application from becoming unresponsive while dealing with such tasks.

Redis Integration
Redis (Remote Dictionary Server) is a popular key-value store that offers an easy way to create, read, update, and delete data items via a client's API. It provides persistence and high availability for your queues by utilizing its in-memory storage, which allows you to achieve high performance due to its nonblocking I/O and fast network communication.

Setting up the Workflow
1. Create a job class that extends Queueable and implements InteractsWithQueue trait:
   <code>class GetFromDocumentsAPI implements ShouldQueue {
       use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

       protected $csv_id;
       // ...
   }</code>
2. Define your job's constructor and handle method to execute the task:
   <code>class GetFromDocumentsAPI implements ShouldQueue {
       public function __construct($csv_id) {
           $this-&gt;csv_id = $csv_id;
       }

       public function handle() {
           // Handle your API call and process the data
       }
   }</code>
3. Dispatch the job using a job queue:
   <code>class ImportController extends Controller {
       public function checkAgainstDocuments($csv_id) {
           GetFromDocumentsAPI::dispatch($csv_id)->delay(now()->addMinutes(10));
       }
   }</code>
4. Configure the queue in your Laravel application (config/queue.php):
   <pre><code>'default' =&gt; env('QUEUE_DRIVER', 'redis'),

'redis' =&gt; [
        'driver' =&gt; 'redis',
        'connection' =&gt; 'default',
        'queue' =&gt; env('REDIS_QUEUE', 'default'),
        'retry_after' =&gt; 90,
        'block_for' =&gt; null,
    ],</code></pre>

Using Queue::later() to Handle Long-Running Tasks
In case the time required for a specific task is unpredictable but should not exceed a certain amount, you can use Laravel's Queue::later() function. This method delays the execution of your job based on the provided time, ensuring that it does not block the application or its users:
   <code>class ImportController extends Controller {
       public function checkAgainstDocuments($csv_id) {
           GetFromDocumentsAPI::later(now()->addMinutes(10))->dispatch($csv_id);
       }
   }</code>

Conclusion
By combining Laravel's queue system with Redis, you can effectively process and handle time-consuming tasks without compromising your application's responsiveness. This method ensures that users experience a smooth user interface while the application efficiently handles these long-running processes in the background, ultimately improving your application's performance and scalability.

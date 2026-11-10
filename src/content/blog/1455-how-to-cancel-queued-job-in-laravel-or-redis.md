---
title: "How to cancel queued job in Laravel or Redis"
description: "Title: Canceling Queued Jobs in Laravel and Redis Introduction: In this blog post, we will discuss the process of canceling queued jobs in Laravel and Redis,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Canceling Queued Jobs in Laravel and Redis

Introduction: In this blog post, we will discuss the process of canceling queued jobs in Laravel and Redis, covering various aspects such as identifying pending jobs from a specific Mailable, locating the job within your Redis queue, and ultimately, canceling it. We'll also explore some available tools, like FastoRedis, to make this task easier.

<h2>Browsing Pending Jobs in Laravel</h2>

To understand how we can locate and interact with pending jobs, you need to know that Laravel uses a queue system to handle time-consuming tasks asynchronously. It stores these queued jobs in various storage types, with Redis being one of the most popular options due to its speed and flexibility.

<h2>Identifying Pending Jobs from a Specific Mailable</h2>

In your Laravel code, you can identify pending jobs by their queue name or job class. In your case, we assume that your Mailable is based on the 'MyCustomMailable' class. To find all the pending jobs related to this class, you might use the following code:

<pre><code>use Illuminate\Support\Facades\Queue;

$jobs = Queue::getPendingRelease(null, function ($job) {
    // check if job is an instance of MyCustomMailable
    return $job instanceof \App\Jobs\MyCustomMailable;
});</code></pre>

This code will retrieve all pending jobs with the specified class and store them in the $jobs array. You can then iterate through these jobs to perform any necessary actions, such as canceling them.

<h2>Finding a Specific Pending Job via Redis</h2>

Now that we've identified pending jobs for our Mailable class, let's look at how you might use FastoRedis or other tools to browse the queue and locate the job you wish to cancel. To achieve this using FastoRedis:

1. Install FastoRedis by running 'composer require predis/predis'.
2. Create a new command line tool using Artisan and add it to your app's command list.
3. Inside the command, you can use the FastoRedis client to browse the Redis queue:

<pre><code>use Illuminate\Support\Facades\Artisan;
use Predis\Client as Redis;

public function handle() {
    $redis = new Redis();
    $queueName = 'my_custom_mailable'; // update with your queue name

   // list all pending jobs in the queue
   foreach (iterator_to_array($redis->brpop(0, 100000, $queueName)) as $job) {
       echo $job . PHP_EOL;
   }
}</code></pre>

4. Run your command and review the output to find the job ID of the Mailable you wish to cancel.

<h2>Canceling a Queued Job</h2>

You've successfully identified the pending job to cancel. Now, let's see how we can actually cancel it. You may need root access on your server to do this if you are running Redis as a standalone service:

1. Connect to your Redis server via the command line using 'redis-cli'.
2. To remove a job from the queue, use the 'DEL' command with the job ID as an argument.
3. For example, if the job ID is 100, execute 'DEL my_custom_mailable:100'.

<h2>Conclusion</h2>

In this comprehensive blog post, we've explored various approaches to browse pending jobs in your Laravel application and Redis queue, focusing on canceling a queued Mailable job. By following these steps, you should now be able to handle any unwanted scheduled tasks efficiently and effectively. Remember always to use caution when modifying server settings or deleting jobs from your queue as these actions could lead to unintended consequences if not executed correctly.

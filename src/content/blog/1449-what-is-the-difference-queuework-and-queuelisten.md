---
title: "What is the difference queue:work and queue:listen"
description: "Title: Unraveling the Difference Between Laravel's queue:work and queue:listen Commands Introduction: In this blog post, we will discuss the differences..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

Title: Unraveling the Difference Between Laravel's queue:work and queue:listen Commands

Introduction: In this blog post, we will discuss the differences between two fundamental command line tools of Laravel - queue:work and queue:listen. Both these commands help manage the queues within your project. We'll explain their purposes, functionality, and how they differ from one another to provide a comprehensive understanding.

1. The Basics: Understanding Queueing Systems in Laravel
Before we dive into the details of each command, let's understand what queuing is. In programming, queueing deals with handling tasks or jobs asynchronously rather than executing them synchronously. This approach improves performance and allows for better resource management by freeing up memory while processing tasks one at a time.

2. What is Laravel queue:listen?
Laravel's queue:listen command is designed to monitor a given queue in your project, waiting for new jobs to enter the queue. It will process each job as it becomes available, ensuring that all jobs are executed on demand. The command runs continuously until you explicitly stop it or close the terminal window where it was executed.

Here's an example of how to run Laravel's queue:listen command:
```bash
php artisan queue:listen --daemon
```
The above command starts the daemon process, which will keep running in the background even after the terminal window is closed. This ensures that your queue continues listening and processing jobs regardless of whether you have access to the terminal or not.

3. What is Laravel queue:work?
Laravel's queue:work command is a more active approach to handle queues. Instead of waiting for new jobs, the command processes the next job on a queue immediately upon execution. After finishing all the available jobs, it waits until the next job arrives or until you manually stop it.

Here's how to run Laravel's queue:work command:
```bash
php artisan queue:work --tries=3 --fail
```
This example demonstrates running the queue:work command with three attempts before considering a job as failed, and then failing it. This ensures that jobs do not get stuck indefinitely if they cannot be processed successfully for whatever reason.

4. Differences Between queue:listen and queue:work
As mentioned earlier, both commands serve different purposes when handling queues in Laravel projects. Here are the key differences between them:

- queue:listen listens to a given queue, waiting for new jobs, and processes them as they arrive. It keeps running until stopped explicitly or the terminal window is closed. Conversely, queue:work actively processes the next job on a queue after execution without waiting for any new jobs.
- Both commands run indefinitely by default, but their behavior can be altered with options like daemon and tries. In the case of queue:listen, you can use --daemon to run it as a background process continuously. For queue:work, you can specify --tries to define the number of attempts before considering a job failed.
- From a resource perspective, queue:listen is more memory efficient as it listens for jobs without actively processing them until they are available. Meanwhile, queue:work utilizes more resources due to its active approach by handling the next job on the queue immediately after execution.

Conclusion:
Both Laravel's queue:listen and queue:work commands play crucial roles in managing your application's queues. While they differ in terms of functionality and resource consumption, one command isn't necessarily better than the other. Choose the appropriate command based on your project's specific needs and requirements. By understanding these differences, you can effectively optimize Laravel to handle your application's tasks seamlessly.

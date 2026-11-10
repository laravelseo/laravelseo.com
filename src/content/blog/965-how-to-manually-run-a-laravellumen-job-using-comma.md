---
title: "How to manually run a laravel/lumen job using command line"
description: "Title: Manually Running Laravel/Lumen Jobs Using Command Line: A Comprehensive Guide Introduction: Laravel and Lumen are powerful PHP frameworks that provide..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Manually Running Laravel/Lumen Jobs Using Command Line: A Comprehensive Guide

Introduction: Laravel and Lumen are powerful PHP frameworks that provide various features to make your web development process more efficient. One such feature is the ability to use jobs for asynchronous tasks. In this blog post, we discuss how to manually run a job through the command line, allowing you to control execution without relying on schedulers or cron jobs.

Step 1: Creating and Implementing Your Job Class
To get started, create a new PHP file within your Laravel/Lumen project's folder 'app/Jobs/MyJob.php'. Within this file, define your job class which will have a handle method that executes the intended task. For our example, we'll use a simple command:

<code>namespace App\Jobs;

class MyJob extends Job {
    public function __construct() {}

    public function handle() {
        // Perform your task here
        echo "My job has been executed";
    }
}</code>

Step 2: Executing the Job Manually from Command Line
Now that we have created and implemented the job class, we can run it manually through the command line. To do this, use the Artisan command:

<code>php artisan queue:work --once MyJob</code>

This command will execute your task immediately without connecting to any queue or waiting for scheduled times. You can also specify a different queue name if needed.

Step 3: Running a Specific Method in the Job Class
If you want to run only a specific method within your job class, you have two options:

1. Specify a custom method in your command line execution using Artisan:
In this case, create another handle() method in your job class for the desired task and call it from the command line using its name:

<code>php artisan queue:work --once MyJob@specificMethod</code>

2. Use Closures within your job class to execute a specific section of code:
Alternatively, you can define anonymous functions (closures) in your handle() method that wrap the sections you wish to run. This approach offers more control over which parts are executed and allows for customization without creating an additional method.

Conclusion:
Running Laravel/Lumen jobs manually through the command line is a convenient way to execute tasks outside of schedulers or cron jobs. By following these steps, you'll be able to manage your job execution better while gaining more control over your development process. For further reading and understanding of Laravel and Lumen frameworks, visit https://laravelcompany.com for valuable resources. Always remember that the command <code>php artisan queue:work --once MyJob</code> can be used to run an entire job class, while custom methods can be executed using either their name or closures in the handle() method.

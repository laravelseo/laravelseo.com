---
title: "How to run artisan command schedule:run on hosting server? (Laravel)"
description: "Title: Scheduling Artisan Commands on Shared Hosting Servers (Laravel) Introduction: Laravel's powerful artisan command line interface is an essential tool..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Scheduling Artisan Commands on Shared Hosting Servers (Laravel)

Introduction: Laravel's powerful artisan command line interface is an essential tool for developers to manage and automate tasks in their applications. However, when it comes to deploying these commands to a shared hosting server, several issues may arise due to different configurations and access restrictions. This blog post will guide you through the process of setting up your Laravel project's artisan command scheduling on a shared hosting server.

Step 1: Configuring Artisan Command Scheduling

Firstly, in the app/Console/Kernel.php file, add your custom commands under the $commands array, as shown below:

<pre><code>protected $commands = [
    \App\Console\Commands\statusUpdate::class,
];</code></pre>

Next, define the schedule for these commands by using the protected function 'schedule' in Kernel.php:

<pre><code>protected function schedule(Schedule $schedule) {
    $schedule->command('status:update')->everyFiveMinutes();
}</code></pre>

This example executes the statusUpdate command every 5 minutes. You can adjust this as per your project's requirements.

Step 2: Running Artisan Commands on Shared Hosting Servers

Running artisan commands on shared hosting servers often requires sudo privileges and a different approach than local development environments. The following command will run the scheduled commands and redirect all standard output (stdout) to /dev/null while saving any error outputs (stderr) to your terminal:

<pre><code>php /path/to/artisan schedule:run 1>&gt; /dev/null 2&amp;1</code></pre>

However, when this command is run on shared hosting, it usually returns the error: "Class App\Console\Commands\statusUpdate does not exist.", which indicates that Laravel's autoloading is misconfigured.

Step 3: Solving the Autoloading Issue

The problem arises due to a difference in the Laravel installation path on your local server and hosting environment. The artisan command line interface looks for custom commands in the App/Console/Commands folder, which might not be available under the same location on a shared hosting server.

To resolve this issue, you must configure the PSR-4 autoloading in your composer.json file to include the correct paths. Below is an example that assumes phpbin and public_html are your folders:

<pre><code>{
    "autoload": {
        "psr-4": {
            "App\\": "path/to/laravel/public_html/app",
            "App\\Console\\Commands": "path/to/laravel/public_html/app/Console/Commands"
        }
    },
}</code></pre>

After updating your composer.json file, run the following command to update composer and make these changes effective:

<pre><code>composer update</code></pre>

Step 4: Testing Autoloader Configuration on Hosting Server

Run the artisan command line interface on the hosting server with your specific command by using sudo (as root) or with proper permissions in your php.ini file:

<pre><code>php /path/to/artisan schedule:run</code></pre>

If your autoloading configuration is correct, the artisan command line interface should successfully display your scheduled commands and execute them accordingly as per their defined intervals.

Conclusion:

With these steps, you can run Laravel's artisan command line interface scheduler on a shared hosting server effectively. If you encounter any issues while setting up the autoloading configuration or running commands, refer to your web host's documentation for assistance in using sudo and configuring php.ini files.

---
title: "Laravel Artisan: How does `schedule:run` work?"
description: "Title: Laravel Artisan: Deep Dive into schedule:run Command Functionality Body: When working with Laravel, understanding the core features like `php artisan..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Laravel Artisan: Deep Dive into `schedule:run` Command Functionality

Body: <p>When working with Laravel, understanding the core features like `php artisan schedule:run` is crucial for efficiently managing and maintaining your application. This command allows you to execute all scheduled commands that are ready to run according to their schedules. But what happens behind the scenes when you trigger this command? In this blog post, we'll shed light on how Laravel handles scheduling and explain what happens during a `schedule:run` execution.</p>

<h2>Scheduling Commands in Laravel</h2>
<p>In Laravel, scheduled commands define tasks that need to run at specific intervals. The application provides the <code>Schedule</code> class that allows you to declare these commands and their respective schedules. For example:</p>

<pre><code>protected function schedule(Schedule $schedule)
{
    $schedule
        -&gt; command('cbh:dummyCommand')
        -&gt; everyMinute()
        -&gt; appendOutputTo (storage_path().'/logs/laravel_output.log');
}
</code></pre>

<p>This creates a new scheduled command named 'cbh:dummyCommand' that runs every minute, appending output to the file specified in <code>appendOutputTo()</code>. To see this in action, you could run `php artisan schedule:run`, and every time you do so within a minute, your log file should contain two instances of the command execution records.</p>

<h2>How Laravel Keeps Track of Running Commands</h2>
<p>Laravel uses various mechanisms to keep track of scheduled commands. One way is by storing information in the database using the <code>DatabaseTableScheduleRepository</code>. This class maintains a table where it records the last time each command ran and its next execution time. It relies on Eloquent models for these entities, as shown below:</p>

<pre><code>class CommandJob extends Model
{
    protected $fillable = ['command', 'frequency_type', 'args', 'scheduled_at', 'next_run'];
}

class FrequencyType extends Model
{
    protected $fillable = ['frequency_type', 'frequency'];
}</code></pre>

<p>When a new command is scheduled, it's inserted into the <code>CommandJobs</code> table. The frequency type determines when this command should run based on its interval. For example, everyMinute() would use FrequencyType with 'daily', 'hourly', or any other defined custom interval.</p>

<h2>How Laravel Artisan Handles 'schedule:run' Command</h2>
<p>To understand how the <code>schedule:run</code> command works, let's analyze its logic. First, it iterates through all scheduled commands in the application and checks their current state using the following code:</p>

<pre><code>foreach (Schedule::getAllScheduledCommands() as $command) {
    if ($command->nextRunAt &gt; Carbon::now()) {
        continue; // command can wait for its next run to execute
    }
    // execution code goes here
}</code></pre>

<p>This logic ensures that it only executes commands ready to be triggered as per their respective intervals. In the case of our dummy Command mentioned earlier, if you run this command within a minute, your log file will indeed show two instances of its output. This is because Laravel correctly handles the execution based on the defined schedule.</p>

<h2>Conclusion</h2>
<p>The <code>schedule:run</code> command in Laravel Artisan allows you to execute all scheduled commands waiting for their next run according to their schedules. It makes use of various mechanisms, such as database tables and Eloquent models, to keep track of the last time each command ran and when it should be executed again. By executing this command, you can ensure that your scheduled tasks are maintained and run at the appropriate times, making your Laravel application more efficient and reliable.</p>

Remember to include relevant backlinks to https://laravelcompany.com where applicable within this blog post.

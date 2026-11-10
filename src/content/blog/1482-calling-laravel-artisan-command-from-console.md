---
title: "Calling laravel artisan command from console"
description: "Title: Calling Laravel Artisan Command from Console Body: Learning and understanding Laravel's command line interface (CLI) is crucial for developers who..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Calling Laravel Artisan Command from Console

Body: <p>Learning and understanding Laravel's command line interface (CLI) is crucial for developers who want to automate their tasks and create efficient workflows. This blog post aims at providing a comprehensive guide on how to call a custom Laravel artisan command from the console. We will go through the basics, the necessary files involved, and finally, how to execute the commands from the shell.</p>

<h2>Kernel file</h2>
<pre><code>    namespace App\Console;

    use Illuminate\Console\Scheduling\Schedule;
    use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

    class Kernel extends ConsoleKernel
    {
        /**
         * The Artisan commands provided by your application.
         *
         * @var array
         */
        protected $commands = [
            //
            'App\Console\Commands\FooCommand',      
        ];

        /**
         * Define the application's command schedule.
         *
         * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
         * @return void
         */
        protected function schedule(Schedule $schedule)
        {
            // $schedule-&gt;command('inspire')
            //          -&gt;hourly();
            $schedule-&gt;command('App\Console\Commands\FooCommand')-&gt;hourly();
        }

        /**
         * Register the Closure based commands for the application.
         *
         * @return void
         */
        protected function commands()
        {
            require base_path('routes/console.php');
        }
    }</code></pre>

The kernel file is responsible for defining your custom artisan commands and their respective schedules. The $commands array contains all the artisan commands available in your application, including the FooCommand we will use later in this tutorial. The schedule method configures command execution intervals, which you can choose based on your requirements.

<h2>Command file</h2>
<pre><code>namespace App\Console\Commands;

use Illuminate\Console\Command;

class FooCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:name';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
    }

    public function fire()
    {

        $this->info('Test has fired.');
    }}</code></pre>

The FooCommand file represents the actual artisan command that we want to execute. It includes information like its name, description, and a handle method containing your desired functionality. The fire() method is responsible for displaying our desired output when the command runs successfully.

<h2>Calling the command from shell</h2>
To test the FooCommand from the console, you can use the artisan tinker:
<pre><code>php artisan tinker
(Pry) => App\Console\Commands\FooCommand::fire();
Test has fired.
</code></pre>
You can also run it directly with Artisan:
<pre><code>php artisan command:name
Running command 'command:name'
Applying value to 'command_name' from argument 'name' (input)
Test has fired.
</code></pre>
In both cases, the output should display "Test has fired." as our fire() method specifies. You can now customize your commands or schedule them for automated execution using Laravel's powerful and flexible CLI framework.

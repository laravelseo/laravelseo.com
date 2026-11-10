---
title: "Run artisan command in laravel 5"
description: "Title: Run artisan commands in Laravel 5: A Comprehensive Guide for Developers Body: When working on Laravel 5 applications, you will undoubtedly come across..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Run artisan commands in Laravel 5: A Comprehensive Guide for Developers
Body:

<p>When working on Laravel 5 applications, you will undoubtedly come across the need to execute Artisan console commands. In this comprehensive guide, we will address a common issue that developers face while trying to run artisan command in controllers and provide solutions to effectively utilize these commands within your application.</p>

<h2>Understanding Artisan Commands</h2>
<p>Artisan is the Command-Line Interface (CLI) of Laravel. It provides you with a powerful tool for managing your application without needing to log in to your server's SSH console. For better organization and efficiency, artisan commands are grouped into namespaces based on their functionality. The default namespace is "infyom," where most basic scaffolding and other useful commands reside.</p>

<h2>Running Artisan Commands in Controllers</h2>
<p>While it may seem natural to run artisan commands with the CLI, you might need to execute them from within your application's code. This could be for various reasons such as automating tasks or integrating them into an API endpoint. In that case, you can use Artisan::call() to run any command from within PHP code.</p>
<pre><code> public function store(Request $request)
{
   Artisan::call("php artisan infyom:scaffold {$request['name']} --fieldsFile=public/Product.json");
}
</code></pre>

<h2>Issue with "There are no commands defined in the 'php artisan infyom' namespace." Error</h2>
<p>As mentioned earlier, the error "There are no commands defined in the 'php artisan infyom' namespace" occurs when you try to use a command from within your application that is not part of the default Artisan namespace. Although it may seem confusing at first, this error is not related to running your code but rather an indication that the Artisan command you are using does not fit under the intended namespace.</p>

<h2>Solution: Custom Namespace and Aliasing</h2>
<p>To address the issue of running artisan commands in controllers with custom namespaces, you can create your own artisan command by either using the already existing infyom namespace or creating a new one. Let's go through both options:</p>

<h3>Option 1: Use Existing Infyom Namespace</h3>
<p>In this case, since the provided code snippet is calling the command "infyom:scaffold" from within a controller, you can use the existing infyom namespace. Be aware that this might not be suitable for all commands if they belong to different namespaces and require separate execution.</p>
<pre><code> public function store(Request $request)
{
   Artisan::call("php artisan infyom:scaffold {$request['name']} --fieldsFile=public/Product.json");
}
</code></pre>

<h3>Option 2: Create a New Namespace and Aliasing</h3>
<p>If using a specific namespace for some commands is necessary, you can create a new artisan command with that namespace and alias it under the default artisan namespace. This way, you will be able to use your custom artisan commands while keeping their designated namespaces.</p>

To create a new namespace, follow these steps:
<ol>
   <li>First, navigate to your Laravel project's root directory and execute "php artisan make:command CustomArtisanCommand". This command creates a file in the app/Console/Commands folder called CustomArtisanCommand.php.</li>
   <li>Now, open the newly created CustomArtisanCommand.php file and modify its contents as per your requirements, for example:</li>
</ol>
<pre><code>namespace App\Console\Commands;

use Illuminate\Console\Command;

class CustomArtisanCommand extends Command
{
   /**
    * The name and signature of the console command.
    *
    * @var string
    */
   protected $signature = 'custom:mycommand';

   /**
    * The console command description.
    *
    * @var string
    */
   protected $description = 'My custom command description';

   /**
    * Execute the console command.
    *
    * @return mixed
    */
   public function handle()
   {
      // Custom commands logic goes here
   }
}
</code></pre>
<p>Next, you can alias your new command under the default Artisan namespace using the config/console.php file:</p>
<pre><code>return [
    'commands' => [
        ...
        'infyom:custom_command' => App\Console\Commands\CustomArtisanCommand::class,
    ],
];
</code></pre>
Finally, you can run your custom artisan command from within your code using the alias:
<pre><code> public function store(Request $request)
{
   Artisan::call("php artisan infyom:custom_command {$request['name']} --fieldsFile=public/Product.json");
}
</code></pre>

Conclusion:
In this comprehensive guide, we have explored the issue of running artisan commands in controllers and provided two solutions to effectively overcome them. By following these steps, you will be able to utilize the full power of Laravel's Artisan console within your application's code.

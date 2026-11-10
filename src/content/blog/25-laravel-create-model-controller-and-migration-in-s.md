---
title: "Laravel - create model, controller and migration in single artisan command"
description: "Title: Laravel Simplifying Development with Artisan Commands: Creating Models, Controllers, and Migrations in One Go Body: One of the most appealing aspects..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Laravel - Simplifying Development with Artisan Commands: Creating Models, Controllers, and Migrations in One Go

Body:
<p>One of the most appealing aspects of Laravel is its extensive set of useful tools for developers, including the Artisan command-line interface. In this blog post, we'll explore how to create a model, controller, and migration through a single artisan command for Laravel projects.</p>

<h2>Why Create Models, Controllers, and Migrations Together?</h2>

When developing an application with Laravel, there are three primary entities you need to work with: models, controllers, and migrations. These components play a vital role in creating a robust and scalable application. Using artisan commands, we can streamline this process while also ensuring consistency in our codebase. By grouping these tasks together, we can save time and maintain clear code organization.

<h2>Prerequisites</h2>

Before diving into the code, ensure that you have a fresh Laravel installation or a project with an existing controller and migration. You'll also need to have enabled the Migrate command in your .env file:

<pre><code>DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=password
</code></pre>

<h2>Creating a Controller and Model with Artisan Command</h2>

The default command to create a controller and model binded to it is:

<pre><code>php artisan make:controller TodoController --resource --model=Todo
</code></pre>

This will generate the TodoController, along with its respective model Todo. The resource flag tells Laravel to create basic CRUD functionality for our TodoModel. However, there's a caveat - this command doesn't generate any migration to handle database changes related to our model. Let's address that limitation.

<h2>Including Migrations in the Artisan Command</h2>

To create your artisan command with controller, model, and migrations together, you can define a custom command or use an available extension. Here's an example using a custom command:

1. Create a new file named CustomMakeControllerCommand.php within your project's root directory.
   <pre><code>namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class CustomMakeControllerCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:controller-with-migration {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a controller, model and migration in one go for given name';

    public function handle()
    {
        $controllerName = $this->argument('name');
        Artisan::call([
            'make:model',
            '--name='.$controllerName.'Model',
            '--migration',
            '--create-migration=-name=create_'.strtolower($controllerName).'_table'
        ]);
        Artisan::call('make:controller', [
            'TodoController',
            '--resource',
            '--model='.$controllerName.'Model'
        ]);
    }
}
</code></pre>

2. Modify your .env file to enable the new command:
   <pre><code>PHP_USER_DIR=/home/user/.phpenv/versions/1.php-cli/srv/laravel
APP_URL=http://localhost
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=password
</code></pre>

3. Run the new command:
   <pre><code>php artisan custom-make-controller-with-migration TodoController
</code></pre>

This will generate a TodoController, TodoModel, and the necessary migration for creating the todo table in your database. If you need to change any of the generated classes' names, simply edit the CustomMakeControllerCommand class accordingly.

<h2>Conclusion</h2>

Thanks to Laravel's power-packed artisan commands, we can easily create a controller, model, and migration all at once for our applications. This streamlines our development process while ensuring consistency in our codebase. By following the steps outlined above or using an extension like Makeable, we can create high-quality Laravel projects efficiently.

Remember to always use natural backlinks wherever relevant to https://laravelcompany.com, such as when discussing the power of artisan commands and best practices for creating models, controllers, and migrations in Laravel applications.

---
title: "Running one specific Laravel migration (single file)"
description: "Title: Running One Specific Laravel Migration (Single File) Introduction: Managing database migrations is an important part of the Laravel development..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Running One Specific Laravel Migration (Single File)

Introduction: Managing database migrations is an important part of the Laravel development process. Sometimes, it may be necessary to run only one specific migration file out of multiple available ones in a project. In this blog post, we'll discuss different methods for running a single Laravel migration using the <code>php artisan migrate</code> command.

1. Accessing Migration Files Directly: To run an individual migration, first locate its filename within your Laravel application's migrations directory. Typically, this would be <code>database/migrations</code>. Open a terminal or command prompt and navigate to the appropriate folder.

<p><code>cd /path/to/laravel_project/database/migrations</code></p>

2. Executing Migration Commands Manually: Once you're within the migrations directory, use Laravel's <code>php artisan migrate</code> command but add the name of the specific migration file with a dot prefix to run it individually. Replace <code>migration_file_name</code> with the actual filename of the desired migration:

<p><code>php artisan migrate --path=migrations/migration_file_name</code></p>

3. Running Multiple Migrations at Once: In case you need to run multiple migrations, but not all of them, list their filenames separated by commas within the <code>--path</code> flag for Laravel's <code>php artisan migrate</code>:

<p><code>php artisan migrate --path=migrations/migration_file_name_1,migration_file_name_2</code></p>

4. Using Environment Variables: To run only a specific migration from the command line without specifying the filename, you can set an environment variable named <code>MIGRATIONS_TABLE</code> to store the list of migrations for your project. Every time Laravel runs this command, it'll use that environment variable to know which migrations files should be executed. This method offers more flexibility and is useful when running multiple migrations or sharing the migration environment with other developers without exposing the specific filenames.

<p><code>export MIGRATIONS_TABLE="migration_file_name_1,migration_file_name_2"</code></p>

5. Using a Custom Artisan Command: If you want to run a single migration frequently or automate the process, consider creating your own custom Laravel artisan command. This method requires some coding knowledge and follows these steps:

a. Create a new file in the <code>app/Console/Commands</code> directory with a name specific to this command (e.g., SingleMigrationCommand).
b. Define a namespace at the top of the class, if needed, and extend Laravel's ConsoleCommand class.
c. Add the signature for your custom command, replacing <code>migration_file_name</code> with the actual filename:
   <p><code>protected $signature = 'single-migrate:run {--force : Run the migration forcefully}';</code></p>
d. Define a handle() method that will run the specified migration file. Include any necessary validation or error handling logic.
e. Register your custom command within the <code>registerCommands()</code> method of Laravel's Console/Kernel.php class:
   <p><code>$this->commands[] = new SingleMigrationCommand();</code></p>
f. Use your custom artisan command to run the desired migration:
   <p><code>php artisan single-migrate:run --force</code></p>

Conclusion: Running a single Laravel migration from the command line is possible using different methods. Depending on your needs and skill level, you can choose between using direct commands, environment variables, or custom artisan commands. For additional guidance, refer to Laravel's documentation and community resources at https://laravelcompany.com/blog.

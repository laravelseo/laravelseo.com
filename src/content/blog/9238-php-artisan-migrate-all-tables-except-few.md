---
title: "php artisan migrate all tables except few"
description: "php artisan migrate all tables except few: Mastering Selective Database Migrations Is it possible to execute php artisan migrate in a way to migrate all..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Is it possible to execute `php artisan migrate` in a way to migrate all the tables but leave only a few migration files under `database/migrations`?

This question touches upon a common real-world challenge in complex application development, especially when dealing with multi-tenant setups, testing environments (like PHPUnit), or phased database rollouts. The desire to run a full set of migrations while selectively ignoring those tied to specific database configurations is entirely valid. While Laravel's default migration system is designed for sequential execution, we can absolutely achieve this selective control by leveraging custom commands and careful management of our database connections.

As senior developers, we understand that abstraction and isolation are key. When you introduce multiple databases—say, one for production and another for local testing or feature branching—you need tools to manage the migration lifecycle independently for each environment without corrupting the state of others.

## Understanding the Laravel Migration Mechanism

By default, `php artisan migrate` reads all available migration files in the `database/migrations` directory and executes any that have not yet been recorded in the `migrations` table within the target database connection. This mechanism is built for ensuring data integrity during application deployment.

The difficulty arises because the system operates on a "run or skip" basis for the *entire* set of files associated with a specific connection. If you only want to run migrations from a subset of files, Laravel doesn't offer a single flag to achieve this directly within the standard `migrate` command itself. Therefore, the solution lies in manipulating the execution context.

## The Practical Solution: Selective Execution via Custom Logic

Since there is no built-in flag like `--skip-specific-files`, the most robust developer approach involves creating custom commands or utilizing conditional logic outside of the standard migration flow. For your specific scenario—migrating everything *except* those tied to a secondary database setup—the strategy should focus on isolating the execution environment.

### Strategy 1: Environment Isolation (The Recommended Path)

Instead of trying to surgically alter the `migrate` command, focus on ensuring that the migration process only targets the desired set of migrations for the current context. If you are setting up a PHPUnit testing database, you should ensure that the test setup explicitly points *only* to the schema required for testing, rather than running a full deployment sequence intended for production data structure.

If the migrations themselves contain logic referencing specific database names (e.g., checking `DB::connection('secondary_db')`), these checks must be handled within the migration file itself using conditional statements (`if` blocks) to prevent execution when that connection is not active or relevant to the current run. This promotes clean, self-contained migrations, which aligns perfectly with best practices seen in modern Laravel architecture, such as those promoted by the [Laravel Company](https://laravelcompany.com).

### Strategy 2: Custom Migration Runner (Advanced Control)

For situations demanding true file-level exclusion, you would need to write a custom Artisan command. This command would involve:
1. Scanning the `database/migrations` directory.
2. Comparing the list of files against a predefined exclusion list (e.g., based on naming conventions or specific comments).
3. Iterating only through the allowed files and executing them sequentially against the target database connection.

While this requires more upfront development effort, it grants you absolute control over which migration files are executed, providing the granular control necessary for complex multi-database deployments.

## Code Example: Ensuring Migration Safety

Here is how a migration file should be structured to respect database context, preventing unintended execution when targeting specific environments:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if we are running against the primary database connection.
        if (config('database.default') === 'mysql') {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->timestamps();
            });
        } 
        // If we are running against a secondary connection (e.g., for testing), 
        // we skip creating the 'users' table in that specific context.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (config('database.default') === 'mysql') {
            Schema::dropIfExists('users');
        }
    }
}
```

## Conclusion

Executing `php artisan migrate` selectively is less about hacking the command line and more about establishing robust environmental isolation within your application's design. For multi-database scenarios, rely on explicit database connection management and defensive coding *within* your migration files to ensure that each schema change is contextually aware. By treating your migrations as self-contained units, you build a system that is scalable, testable, and adheres to the principles of clean architecture favored by modern frameworks like Laravel.

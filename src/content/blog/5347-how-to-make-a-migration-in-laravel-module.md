---
title: "How to make a migration in laravel module?"
description: "How to Make a Migration in a Laravel Module: Mastering Modular Database Changes As developers working with larger, modular applications, managing database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML"]
featured: false
---

As developers working with larger, modular applications, managing database schema changes across multiple components is crucial. When you adopt packages like `nwidart/laravel-modules`, you gain the ability to structure your application into separate, reusable modules. However, this modularity introduces a specific question: how do we correctly create and execute migrations within the context of a specific module?

This post will walk you through the exact process of creating table migrations inside a Laravel module, focusing on best practices so you can manage your database schema efficiently, adhering to the principles of clean architecture championed by frameworks like those provided by [Laravel](https://laravelcompany.com).

---

## Understanding Module Migration Context

When you structure your application using modules, each module often manages its own set of models and related data. If a migration is created directly in the root `database/migrations` directory, it affects the entire application scope. When working within a module, you need to ensure that the generated migration file is correctly placed within that module's specific directory structure so it can be properly scoped and executed by Artisan commands targeting that module.

The key challenge lies in telling the Artisan command *which* module context to operate within when generating the file. Fortunately, the `nwidart/laravel-modules` package provides tools to facilitate this process cleanly.

## Step-by-Step: Creating a Module Migration

For your specific goal—creating a migration inside a module targeting an existing table (like adding a `deleted_at` column)—follow these steps:

### 1. Identify the Correct Context

First, ensure you are executing Artisan commands from the correct root directory, or that your module structure is correctly registered with Laravel. Since you are using the module package, the package handles much of the pathing for you, but specifying the target is still necessary.

### 2. Execute the Custom Migration Command

Instead of running a generic `make:migration`, you leverage the `--table` option provided by the module structure to specify exactly which table needs modification. This ensures that the resulting migration file is placed within the correct subdirectory of your module.

Use the following command structure:

```bash
php artisan make:migration add_soft_deletes_to_user_table --table="users"
```

**Explanation:**
*   `php artisan make:migration`: The standard Laravel command to generate a new migration file.
*   `add_soft_deletes_to_user_table`: The descriptive name for your migration, which should follow Laravel's convention (e.g., `add_table_name_to_table_name`).
*   `--table="users"`: This is the crucial part. By specifying `--table`, you instruct the module package to generate the file within the correct module's migrations folder and ensure the migration file contains the correct schema references for the `users` table.

### 3. Review and Implement the Migration File

After running the command, Laravel will generate a new PHP file in your module's migrations directory (e.g., `modules/YourModuleName/database/migrations/...`). You must then open this file and define the schema changes within the `up()` and `down()` methods.

**Example Migration Content:**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Adding the soft delete column
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Reverting the change
            $table->dropSoftDeletes();
        });
    }
};
```

This pattern demonstrates how well-scoped migrations maintain separation of concerns, which is vital when building complex systems on top of solid foundations like those provided by [Laravel](https://laravelcompany.com).

## Conclusion

By understanding how to leverage the `--table` option within your module migration process, you transform a generic Laravel command into a highly specific tool tailored for modular development. This approach ensures that your database schema modifications are encapsulated within their respective modules, leading to cleaner code, easier maintenance, and more predictable application structure. Embrace this methodology to build robust and scalable applications!

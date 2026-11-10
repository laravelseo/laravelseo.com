---
title: "Laravel seed database from existing database"
description: "Migrating Data: Seeding Your New Laravel Application from an Existing Database As developers, we often face the reality where existing data resides in one..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "HTML", "Errors"]
featured: false
---

As developers, we often face the reality where existing data resides in one structure, but our application’s new architecture demands a completely different schema. The challenge then becomes the migration of this historical data into the new framework—a common hurdle when adopting a fresh setup or refactoring an existing system.

The question is: **Can you use Laravel seeders to import data from an old database format into a new structure?**

The short answer is a resounding **yes**. This is entirely possible and, in fact, a very common requirement in real-world application development. It requires a strategic approach that leverages Laravel’s robust Eloquent ORM and Query Builder capabilities, rather than relying solely on simple, static seed data.

## The Strategy: Bridging the Old and New Worlds

Directly mapping complex data transformations within a standard seeder is the key. You cannot simply copy tables; you must read the old data, apply your transformation logic (mapping fields, calculating new values), and then insert the results into the new database structure.

This process usually involves three main steps:

1.  **Connection:** Establishing a connection to the source (old) database.
2.  **Extraction & Transformation:** Executing queries on the old database and processing the result set within your seeder class.
3.  **Insertion:** Using Eloquent or the Query Builder to write the transformed data into the new tables.

## Practical Implementation with Laravel Seeders

Since a seeder is executed within the context of your Laravel application, we can utilize the `DB` facade (or Eloquent models) to interact with both databases if they share the same connection configuration, or use raw connections for external sources. For this example, we will focus on reading from an external source and writing to the local database.

Imagine you have an old table named `legacy_users` and you need to populate your new `users` table.

### Step 1: Define the Seeder Class

We create a custom seeder dedicated to this migration task.

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User; // Assuming your new model is User

class LegacyDataSeeder extends Seeder
{
    /**
     * Run the database seeder.
     *
     * @return void
     */
    public function run()
    {
        // 1. Fetch data from the legacy system (assuming connection setup allows this)
        $legacyData = DB::connection('old_database')->table('legacy_users')->get();

        if ($legacyData->isEmpty()) {
            $this->command->info('No legacy data found to import.');
            return;
        }

        // 2. Transform and Insert the Data
        foreach ($legacyData as $legacyUser) {
            // Perform necessary mapping logic here
            $newUser = new User();
            $newUser->first_name = $legacyUser->first_name;
            $newUser->last_name = $legacyUser->last_name;
            $newUser->email = $legacyUser->legacy_email; // Example transformation
            $newUser->password = bcrypt('default_pass'); // Set a default for new structure

            $newUser->save();
        }

        $this->command->info(count($legacyData) . ' records successfully migrated.');
    }
}
```

### Step 2: Register and Run the Seeder

You would then call this seeder from your main `DatabaseSeeder.php` file or run it directly via Artisan:

```php
// In DatabaseSeeder.php
public function run()
{
    $this->call(LegacyDataSeeder::class);
}
```

## Best Practices for Data Migration

When dealing with large-scale data imports, keep these best practices in mind:

1.  **Use Raw Queries Sparingly:** While the example uses `DB::table()->get()`, for extremely complex joins or massive datasets, optimizing the raw SQL query before fetching can improve performance significantly.
2.  **Handle Errors Gracefully:** Always implement try-catch blocks or check the results of your queries to prevent partial data insertion if a record fails transformation.
3.  **Transaction Management:** If you are performing many inserts in a loop, consider wrapping the insertions within a database transaction to ensure that either all records succeed or none do.
4.  **Laravel Ecosystem:** Adopting established patterns, such as those promoted by the Laravel community, ensures your migration scripts remain clean and maintainable, which is crucial when building complex systems like those discussed on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Migrating data between different database structures using Laravel seeders is not only possible but is a powerful way to manage system evolution. By treating the seeder as a dedicated ETL (Extract, Transform, Load) script, you gain full control over how historical data flows into your new application. This approach ensures that you maintain data integrity while smoothly transitioning your application architecture.

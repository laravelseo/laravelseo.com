---
title: "Illuminate\\Database\\QueryException with message 'SQLSTATE[42S02]: Base table or view not found: 1146 Table 'test.people' doesn't exist"
description: "Solving the Dreaded Table '... doesn't exist Error in Laravel: A Deep Dive into Migrations and Eloquent As a senior developer working with the Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "HTML", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we constantly encounter frustrating runtime errors. One of the most common—and often most confusing—errors developers face involves database interactions, specifically the infamous `Illuminate\Database\QueryException` with messages like `'SQLSTATE[42S02]: Base table or view not found: 1146 Table 'test.people' doesn't exist'`.

This error typically arises when you try to interact with a database table (via Eloquent models, raw SQL queries in Tinker, or any other database operation) before that table has been properly created in the underlying database schema.

This post will dissect exactly why this happens and provide a comprehensive, step-by-step guide on how to ensure your migrations execute correctly so you can move past this roadblock.

---

## Understanding the Root Cause: The Migration Pipeline Gap

The core issue behind the error `'Table 'test.people' doesn't exist'` is a mismatch between the state of your migration files and the actual state of your database.

When you create a new migration (e.g., `create_people_table`), you are defining *how* to build the table. However, simply creating the file does not automatically execute the changes against your live database. The crucial missing step is running the Artisan command that bridges the gap between your code (the migration) and the database structure (the actual tables).

If you attempt to use Tinker or Eloquent to query a model (like `People::all()`) immediately after creating the migration file, Laravel looks for the table defined by that model. If the migration hasn't been run yet, the table simply doesn't exist, resulting in the SQL error.

## The Correct Workflow: Executing Migrations Properly

To resolve this issue, you must follow a strict sequence when working with database changes in Laravel. This ensures that the schema is built *before* any application logic attempts to read or write to it.

### Step 1: Verify Migration Naming and Contents

First, ensure your migration file accurately reflects the table name you intend to use. For instance, if you are creating a table named `people`, your migration must contain the correct schema definition referencing that table.

Check your migration file (e.g., in `database/migrations/`):

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreatePeopleTable extends Migration
{
    public function up(): void
    {
        // Ensure the table name here matches what you expect to query later
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('people');
    }
}
```

### Step 2: Running the Migrations

The actual step that populates your database is running the migration command. This process reads the defined schema changes and executes the corresponding SQL commands against your database connection.

Execute the following command in your terminal:

```bash
php artisan migrate
```

This command ensures that all pending migrations are executed sequentially, creating the `people` table (or whatever table name you defined) in your database. Once this command successfully completes, the table exists, and subsequent Eloquent queries or Tinker commands will succeed.

## Using Tinker Safely After Migration

When working within Tinker to test data loading, always ensure that the setup phase is complete. If you are trying to seed data using Tinker:

```php
// This will fail if 'people' table doesn't exist yet!
\App\Models\People::create(['name' => 'Test User']);
```

Ensure you run `php artisan migrate` first. After that, when entering Tinker, your database connection is ready to accept Eloquent operations. For robust data seeding, remember that Laravel provides powerful tools to manage this process, which aligns perfectly with the principles of building robust applications as promoted by the **Laravel Company** philosophy on clean architecture and efficient development practices.

## Conclusion: Consistency is Key

The `Table not found` error in Laravel migrations is almost always a simple matter of execution order. It highlights that database operations are inherently sequential: define the structure (migration), then build the structure (migrate), and finally, interact with the structure (Eloquent/Tinker). By strictly adhering to running your migrations before attempting any data interaction, you ensure transactional integrity and eliminate these frustrating runtime exceptions. Always treat your migration files as the blueprint for your database, and always run the `migrate` command to bring that blueprint to life!

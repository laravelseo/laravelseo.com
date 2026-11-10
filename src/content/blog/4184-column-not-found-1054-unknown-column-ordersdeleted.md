---
title: "Column not found: 1054 Unknown column 'orders.deleted_at' in 'where clause'"
description: "Fixing \"Column not found: 1054 Unknown column 'orders.deleted at' in 'where clause'\" in Laravel As a senior developer working with the Laravel ecosystem,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, you’ve likely encountered this frustrating SQL error: `Column not found: 1054 Unknown column 'orders.deleted_at' in 'where clause'`. This error typically surfaces when using Eloquent models that implement soft deletes, but the underlying database schema has not been properly updated to reflect these changes.

This post will dive deep into why this happens and provide a comprehensive, practical solution for fixing this discrepancy between your application logic (Eloquent) and your database structure.

---

## Understanding the Root Cause: Eloquent vs. Database Reality

The error message clearly indicates that when Laravel attempts to execute a query—specifically one involving checking for soft-deleted records (`where('deleted_at', null)`)—the database cannot find the column named `deleted_at` on the `orders` table.

This situation arises because Eloquent’s `SoftDeletes` trait automatically applies a global scope to all models that use it. This scope modifies every query performed on that model to automatically include `WHERE deleted_at IS NULL`.

The problem is a mismatch:
1. **Eloquent Expectation:** The model assumes the `deleted_at` column exists because the `SoftDeletes` trait is active.
2. **Database Reality:** The actual migration file responsible for creating the `orders` table was never run, or it was run without including the necessary column definition.

When your code executes:
```php
$this->where('deleted_at', null) // Eloquent adds this automatically
```
The database throws an error because that specific column does not exist in the physical table structure.

## Solution 1: The Correct Fix – Updating the Database Schema

The most robust and correct solution is to ensure your database schema exactly matches what your application expects. If you are using soft deletes, you *must* have the `deleted_at` nullable timestamp column on your table.

You need to create or update a migration to add this missing column to your `orders` table.

### Step-by-Step Migration Fix

1. **Generate a New Migration:** Use the Artisan command to create a new migration file.
   ```bash
   php artisan make:migration add_deleted_at_to_orders_table --table=orders
   ```

2. **Define the Schema Change:** Open the newly created migration file and define the schema change within the `up()` method. Ensure you use the correct column type (usually `timestamp` or `dateTime`).

   ```php
   // database/migrations/..._add_deleted_at_to_orders_table.php

   use Illuminate\Database\Migrations\Migration;
   use Illuminate\Support\Facades\Schema;

   return new class extends Migration
   {
       public function up(): void
       {
           Schema::table('orders', function (Blueprint $table) {
               // Add the deleted_at column, allowing null values initially
               $table->softDeletes(); // This is the simplest way if you are using SoftDeletes
               // OR manually define it:
               // $table->timestamp('deleted_at')->nullable();
           });
       }

       public function down(): void
       {
           Schema::table('orders', function (Blueprint $table) {
               // Rollback logic
               $table->dropSoftDeletes();
           });
       }
   };
   ```

3. **Run the Migration:** Execute the migration to update your database structure.
   ```bash
   php artisan migrate
   ```

By running this migration, you establish the necessary column in the database. Now, when Eloquent queries for soft-deleted records, the `deleted_at` column exists, and the query succeeds without error. This adheres to Laravel’s philosophy of keeping the application logic clean while ensuring data integrity at the persistence layer, much like how robust frameworks like those promoted by [Laravel](https://laravelcompany.com) handle complex database interactions.

## Solution 2: Alternative – Removing Soft Deletes (If Not Required)

If you determine that soft deletes are not a feature required for your `orders` model—perhaps you prefer hard deletes or manage deletion logic entirely within your application layer without relying on Eloquent's global scope—you can simply remove the trait.

1. **Modify the Model:** Open your `Order` model and remove the use of the trait:
   ```php
   // app/Models/Order.php

   use Illuminate\Database\Eloquent\Model; // Keep this
   // use Illuminate\Database\Eloquent\SoftDeletes; // Remove this line

   class Order extends Model
   {
       // No SoftDeletes trait applied
   }
   ```

2. **Update Models:** Ensure that any other models referencing the `Order` relationship are also updated accordingly.

This approach bypasses the need for the `deleted_at` column entirely, resolving the error by removing the source of the conflict. However, if you *intend* to use soft deletes, **Solution 1 (fixing the migration)** is the recommended path forward.

## Conclusion

The "Column not found" error in this context is a classic symptom of an inconsistency between application code and database structure. As senior developers, we must always enforce consistency across the stack. Always ensure that your database migrations are executed correctly, as they form the contract between your Eloquent models and your SQL tables. By properly updating your schema via migrations, you ensure that your Laravel application remains clean, predictable, and fully functional.

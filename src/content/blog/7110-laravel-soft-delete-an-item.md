---
title: "Laravel: Soft Delete an item"
description: "Laravel: Mastering Soft Deletes for Data Integrity As a senior developer working with modern frameworks like Laravel, one of the most crucial concepts for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As a senior developer working with modern frameworks like Laravel, one of the most crucial concepts for maintaining data integrity and history is understanding the difference between a hard delete and a soft delete. You've asked a very common and important question: How can I delete an item only from my view without permanently erasing it from the database? The answer lies in implementing **Soft Deletes**.

This post will walk you through the entire procedure, from setting up your database to modifying your Eloquent models, ensuring you can manage your data history effectively.

## What are Soft Deletes and Why Use Them?

When you perform a standard `DELETE` query in SQL, the record is permanently removed. In most business applications, this is unacceptable because you lose valuable historical data. Soft Deletes solve this problem by replacing the actual deletion with an update to a timestamp column (usually named `deleted_at`). The record remains in the database but is logically marked as deleted.

This allows you to retrieve all records, including those that are no longer visible, providing an audit trail and preventing accidental data loss. This approach is heavily promoted within the Laravel ecosystem, aligning perfectly with the principles of robust application design found on platforms like [laravelcompany.com](https://laravelcompany.com).

## Step-by-Step Implementation Guide

To implement soft deletes in a Laravel application, you need to make three primary changes: database migration, model setup, and controller logic.

### 1. Database Migration Setup

First, you must add a nullable timestamp column named `deleted_at` to your table. This column will store the timestamp when the record was "deleted."

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSoftDeleteToDevisTable extends Migration
{
    public function up()
    {
        Schema::table('devis', function (Blueprint $table) {
            // This column is crucial for soft deletion
            $table->softDeletes(); 
        });
    }

    public function down()
    {
        Schema::table('devis', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
```

Run your migration to apply these changes to your database schema.

### 2. Model Implementation

Next, you must tell your Eloquent model that it should use the soft delete functionality. This is done by using the `SoftDeletes` trait.

In your `Devis` model:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Import the trait

class Devis extends Model
{
    // Use the trait to enable soft deletes
    use SoftDeletes; 

    // ... other model code
}
```

### 3. Controller Logic: Soft Deleting vs. Hard Deleting

This is where your provided code snippet shows the difference. When you use the `SoftDeletes` trait, the standard `$model->delete()` method performs a soft delete instead of a hard one.

**The Old (Hard Delete):**
```php
public function destroy(Devis $devis)
{
    $devis->delete(); // This removes the record permanently from the DB
    return redirect('/admin');
}
```

**The New (Soft Delete):**
If you want to keep the item in the database but mark it as deleted, using `$devis->delete()` is exactly what you need. The record will be updated with a `deleted_at` timestamp.

```php
public function destroy(Devis $devis)
{
    $devis->delete(); // Performs a soft delete: updates the deleted_at column
    return redirect('/admin');
}
```

## Querying Soft-Deleted Data

The most powerful feature of using `SoftDeletes` is how Eloquent queries automatically adapt. By default, any query you run on your model (e.g., `Devis::all()`) will **automatically exclude** records where `deleted_at` is not null.

If you ever need to retrieve soft-deleted items for administrative purposes, you must explicitly tell Eloquent to ignore the soft delete scope:

```php
// Retrieves ALL records, including soft-deleted ones
$allDevis = Devis::withTrashed()->get(); 

// Retrieves ONLY soft-deleted records
$deletedDevis = Devis::onlyTrashed()->get(); 
```

## Conclusion

Implementing Soft Deletes is a fundamental best practice in modern Laravel development. By leveraging Eloquent's built-in features and correctly configuring your migrations and models, you gain the flexibility to manage data history without compromising data integrity. Always remember that by default, operations like `$model->delete()` will perform a soft delete, giving you the control you need over how your application interacts with the database. Embrace these tools—they make building robust applications significantly easier!

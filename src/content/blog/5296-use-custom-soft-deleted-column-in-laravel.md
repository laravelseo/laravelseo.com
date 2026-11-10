---
title: "Use custom soft deleted column in laravel"
description: "Custom Soft Deleting in Laravel: Using a Custom Column for Model Deletion As senior developers, we often encounter situations where the default framework..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "HTML", "PHP"]
featured: false
---

As senior developers, we often encounter situations where the default framework features are functional but don't perfectly align with our specific business requirements. The Laravel Eloquent `SoftDeletes` feature is incredibly useful, providing a clean way to handle record deletion by simply updating a timestamp. However, sometimes the default implementation—relying on the `deleted_at` column—is insufficient. You need granular control, and that’s where customizing this behavior becomes necessary.

This post will guide you through implementing a custom soft-deletion mechanism in Laravel, utilizing a specific column name like `sender_deleted_at`, allowing you to manage your data lifecycle with maximum flexibility.

## Why Customize Soft Deletes?

The standard `SoftDeletes` trait works by assuming a specific naming convention (`deleted_at`). If your application requires a different convention (perhaps for auditing, tenancy separation, or custom deletion workflows), forcing the use of a custom column is the correct path. By customizing this, you gain total control over how and when records are marked as deleted, which is crucial for complex data integrity rules.

## Step 1: Database Migration Setup

The first step is to update your database schema to include the custom timestamp column instead of relying on Laravel’s default convention.

When setting up your migration, define the new timestamp column:

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCustomSoftDeleteToTable extends Migration
{
    public function up()
    {
        Schema::table('flights', function (Blueprint $table) {
            // Create the custom soft delete column
            $table->timestamp('sender_deleted_at')->nullable()->index();
        });
    }

    public function down()
    {
        Schema::table('flights', function (Blueprint $table) {
            $table->dropColumn('sender_deleted_at');
        });
    }
}
```

Run your migration to apply these changes. This ensures that every record in the `flights` table now has the necessary field to track its soft deletion status, aligning with best practices for database structure as discussed on platforms like [laravelcompany.com](https://laravelcompany.com).

## Step 2: Implementing Custom Model Logic

Since we are bypassing the built-in `SoftDeletes` trait, we must manually implement the methods that Eloquent expects (`forceDelete`, `restore`, etc.) by interacting directly with our custom column (`sender_deleted_at`). We will do this within the `Flight` model.

Here is how you can structure your model to handle these custom operations:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Flight extends Model
{
    // We remove the use SoftDeletes trait as we are implementing our own logic.

    /**
     * Custom method to soft delete a record.
     */
    public function softDelete()
    {
        $this->sender_deleted_at = now();
        $this->save();
    }

    /**
     * Custom method to restore a record.
     */
    public function restore()
    {
        $this->sender_deleted_at = null;
        $this->save();
    }

    /**
     * Custom method to permanently delete a record.
     */
    public function forceDelete()
    {
        // Perform the actual hard deletion from the database
        $this->delete();
    }

    /**
     * Scope to retrieve only soft-deleted models (if needed).
     */
    public function scopeSoftDeleted(Builder $query)
    {
        return $query->whereNotNull('sender_deleted_at');
    }
}
```

## Step 3: Using the Custom Logic in Controllers and Queries

Now that we have defined our custom methods, we can use them wherever needed. For example, instead of calling `$flight->delete()`, you would call your custom soft delete method:

```php
// In a controller or service layer
$flight = Flight::find(1);

if ($flight) {
    $flight->softDelete(); // Uses our custom logic based on sender_deleted_at
}
```

To retrieve records, you can use your custom scope:

```php
// Retrieve all soft-deleted flights
$deletedFlights = Flight::softDeleted();
```

## Conclusion

Customizing framework features provides immense power. While the built-in `SoftDeletes` trait is convenient for standard setups, when dealing with unique business rules—such as renaming columns or implementing complex multi-tenant deletion logic—you must be prepared to step outside the default implementation and manage the data lifecycle yourself. By defining explicit methods like `softDelete()` and tying them directly to your custom column (`sender_deleted_at`), you ensure that your application logic remains perfectly synchronized with your database structure, leading to more robust and maintainable code.

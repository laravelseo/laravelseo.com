---
title: "How to disable updated_at and created_at when saving data in Laravel"
description: "How to Disable updated at and created at When Saving Data in Laravel As developers working with Eloquent models in Laravel, managing timestamps is a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As developers working with Eloquent models in Laravel, managing timestamps is a common task. By default, Eloquent automatically manages the `created_at` and `updated_at` fields for every model, which is incredibly useful for tracking record history. However, sometimes you need to completely decouple your application logic from these timestamp columns, especially if you have manually modified your database schema or require different auditing strategies.

The error you encountered—`SQLSTATE[42S22]: Column not found: 1054 Unknown column 'updated_at' in 'field list'`—occurs because Eloquent, by default, attempts to insert these columns into the database during a save operation. If those columns no longer exist in your table (as you mentioned you deleted them), the SQL query fails immediately.

This post will guide you through the correct, idiomatic ways to disable or bypass the saving of `created_at` and `updated_at` when using the Eloquent `save()` function.

---

## Understanding Eloquent Timestamps

Eloquent models rely on a built-in feature to handle timestamps. This is controlled by the `$timestamps` property within your model class. When set to `true` (the default), Eloquent automatically handles setting these fields whenever a model is saved or updated.

To stop this automatic behavior, you need to explicitly tell Eloquent not to manage these time fields for that specific model.

## Solution 1: Disabling Timestamps on the Model

The most straightforward and recommended way to disable timestamp management for an entire model is by setting `$timestamps` to `false` in your Eloquent model class. This prevents Eloquent from including these columns in its internal operations, thus avoiding errors when saving data to a table where those columns are absent.

Here is how you would modify your `AccountType` model:

```php
<?php

namespace pshub;

use Illuminate\Database\Eloquent\Model;

class AccountType extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];

    /**
     * Disable Eloquent's automatic timestamp management.
     *
     * @var bool
     */
    protected $timestamps = false;

    // Create Type Function
    public function createType($type) {
        $existence = $this->where('name', $type)->get();

        if (count($existence) > 0) {
            return $this->where('name', $type);
        } else {
            $this->name = $type;
            $this->save(); // This save() call will now omit created_at and updated_at
            return $this->id;
        }
    }
}
```

By setting `$timestamps = false`, when you call `$this->save()`, Eloquent will no longer attempt to populate or check these columns in the underlying SQL query, resolving your `Column not found` error. This approach keeps your model clean and aligns with sound object-relational mapping principles advocated by frameworks like Laravel.

## Solution 2: Handling Mass Assignment Safely (Best Practice)

While disabling timestamps solves the immediate database error, it is crucial to maintain strict control over what data gets saved. Always rely on the `$fillable` property to define exactly which attributes are allowed to be mass-assigned. This practice ensures security and data integrity, reinforcing the principles of secure coding that underpin robust applications, much like those promoted by the Laravel ecosystem.

If you are creating a custom method like `createType()`, ensure that all operations within that method respect these constraints:

```php
// Inside your custom function...
$this->name = $type;
$this->save(); // Safe because $timestamps is false and only 'name' is fillable.
```

## Conclusion

To successfully disable `created_at` and `updated_at` saving when using Eloquent’s `save()` function, the most effective method is to configure your model by setting `$timestamps = false`. This cleanly tells the Eloquent ORM not to interfere with these fields during database operations. Always pair this configuration with a strict understanding of your database schema—ensure that if you remove columns from the table, your model configuration accurately reflects that structure to prevent future runtime errors. Mastering these nuances is key to building efficient and maintainable applications within Laravel.

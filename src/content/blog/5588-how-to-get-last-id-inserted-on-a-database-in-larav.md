---
title: "How to get last id inserted on a database in Laravel?"
description: "How to Get the Last Inserted ID in a Database in Laravel? A Developer's Guide Dealing with database auto incrementing IDs is a very common task in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

Dealing with database auto-incrementing IDs is a very common task in application development. When you insert a new record into a table, you almost always need that newly generated primary key immediately to use it for subsequent operations, such as creating related records or displaying the data back to the user.

You've encountered a common stumbling block: trying to call a method like `last()` directly on the Query Builder is not supported in this manner within Eloquent. As you discovered with the `BadMethodCallException`, the Query Builder methods focus on building queries, not necessarily tracking the results of the specific last executed operation.

As a senior developer, I can tell you that while there isn't a single, universal method called `$table->last()`, Laravel provides several robust and idiomatic ways to handle this scenario depending on *how* you perform the insertion. Let’s explore the correct approaches.

## Why the Initial Attempt Failed

The error occurs because methods like `last()` are typically associated with specific database interactions or model hydration, not the generic Query Builder object itself when executing a standard `insert` or `create` operation. To get an ID, you need to interact with the result of that operation, which is usually bound to an Eloquent Model instance.

## Solution 1: Using Eloquent's `create()` Method (The Recommended Way)

The most straightforward and cleanest way to handle insertion when using Eloquent is by leveraging the return value of the `create()` method. When you call `create()`, Laravel handles the insertion, and if your model has a standard auto-incrementing primary key, the new ID is automatically hydrated onto the returned model instance.

Here is an example demonstrating this best practice:

```php
use App\Models\Transferencia;

// 1. Create a new record
$transferencia = Transferencia::create([
    'from_account_id' => 101,
    'to_account_id' => 102,
    'amount' => 500.00,
]);

// 2. The ID is now stored on the model instance
$newId = $transferencia->id;

// Outputting the result
echo "Successfully created a transfer with ID: " . $newId;
```

In this scenario, `$transferencia` is an instance of your `Transferencia` model, and accessing the standard `$transferencia->id` retrieves the ID that was just inserted by the database. This approach keeps your code clean and fully leverages the power of Eloquent relationships and model management, which is a core principle in building applications with Laravel.

## Solution 2: Using the `insertGetId()` Method (For Raw Inserts)

If you are performing a raw insertion using the `DB` facade or need to insert multiple records at once and retrieve all generated IDs immediately, you can use the underlying database functionality provided by the `DB` facade. This method is useful when working with bulk operations that don't necessarily involve creating full Eloquent models immediately.

If your table has an auto-incrementing primary key named `id`, you can execute the query and retrieve the last inserted ID:

```php
use Illuminate\Support\Facades\DB;

$data = [
    'from_account_id' => 101,
    'to_account_id' => 102,
    'amount' => 500.00
];

// Insert the data and retrieve the ID of the last inserted row
$newId = DB::table('transferencias')->insertGetId($data);

echo "The last inserted ID is: " . $newId;
```

This method directly interacts with the database driver to fetch the necessary information, providing a direct route to the auto-increment value. Understanding these low-level interactions alongside Eloquent principles is crucial for mastering data persistence in Laravel.

## Conclusion

To summarize, avoid trying to force methods onto the Query Builder when you need insertion results. For standard CRUD operations in Laravel, **always rely on returning the model instance** after using `create()` or `save()`. This ensures data integrity and follows the conventions of the framework. If you are dealing with complex bulk inserts or direct database manipulation where Eloquent models aren't immediately involved, use methods like `DB::insertGetId()` from the `DB` facade. By mastering these techniques, you can efficiently manage your database interactions within any Laravel application.

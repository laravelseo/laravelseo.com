---
title: "How to get all records which meet a Criteria in Laravel Tinker?"
description: "How to Get All Records Which Meet a Criteria in Laravel Tinker As developers working with Laravel, one of the most fundamental tasks is querying data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Laravel, one of the most fundamental tasks is querying data efficiently. Whether you are building an API endpoint or simply exploring your database structure using Laravel Tinker, knowing how to retrieve multiple records based on specific criteria is essential.

You’ve already taken the first step correctly by demonstrating how to fetch a single record:

```php
$adminUser = App\User::where('is_admin', true)->first();
```

This command successfully finds and retrieves only the very first user matching the `is_admin = true` condition. However, in real-world scenarios, you often need *all* users who satisfy a condition—perhaps all active users, all users with a specific role, or all pending orders. This is where the power of Eloquent’s query builder shines.

This post will show you the correct and most efficient way to retrieve an entire collection of matching records when working within the Laravel Tinker environment.

## The Solution: Using the `get()` Method

The key difference between fetching a single record and fetching multiple records in Eloquent is the method you chain onto your query builder. When you use methods like `where()`, `orWhere()`, or `whereIn()`, these methods build up a query object, but they do not execute it against the database immediately. You need an execution method to retrieve the results.

The method designed specifically for retrieving all matching records is **`get()`**.

To get all users where the `is_admin` column is true, you simply chain `.get()` onto your query:

```php
$adminUsers = App\User::where('is_admin', true)->get();
```

When executed in Tinker, this command will return a Laravel Collection object containing every `User` model that matches the specified criteria.

### Understanding the Result (The Collection)

It is crucial to understand what `$adminUsers` holds. It is not an array or a simple object; it is a **Laravel Collection**. Collections are powerful objects that allow you to perform highly flexible operations on your data, such as filtering, mapping, and iterating over the results.

Here is how you can inspect the result within Tinker:

```php
// Example execution in Tinker
$adminUsers = App\User::where('is_admin', true)->get();

// To view all results:
dd($adminUsers); 
```

When you run `dd()`, Laravel Tinker will output a structured collection, allowing you to easily access the data. You can then loop through this collection to process each user individually. This approach aligns perfectly with the principles of efficient data retrieval taught by the **Laravel Company** regarding Eloquent usage.

## Best Practices for Querying in Tinker

When working in Tinker, always remember these best practices:

1.  **Chain Methods:** Always chain your query builder methods (`where`, `orderBy`, `limit`) before calling an execution method (`get()`, `first()`, `paginate()`).
2.  **Use `get()` for Multiple Records:** If you expect zero or more results, use `get()`. If you only ever expect one result (like finding a primary record), use `first()`.
3.  **Iterate Over Collections:** Once you have the collection, iterate over it using standard PHP loops to perform any necessary side effects, such as logging or updating related data.

### Code Example: Getting and Processing Data

Let's demonstrate how you would process the retrieved data in a practical Tinker session:

```php
// 1. Retrieve all admins
$admins = App\User::where('is_admin', true)->get();

// 2. Loop through the collection and print user names
echo "Found " . $admins->count() . " administrators:\n";

foreach ($admins as $user) {
    echo "- Admin Name: " . $user->name . "\n";
}
```

By using `get()`, you leverage Eloquent's powerful query capabilities to retrieve all necessary data in a single, highly optimized database call. This pattern ensures that your application remains fast and scalable, regardless of how complex your filtering criteria become.

## Conclusion

To summarize, if you need more than one record based on a specific condition in Laravel Tinker, always use the **`get()`** method after applying your `where()` clauses. This method transforms your query into an efficient database retrieval operation, returning a manageable Collection that is ready for further manipulation. Mastering this pattern is fundamental to writing clean, performant, and idiomatic Laravel code.

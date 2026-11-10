---
title: "Laravel - How to replace a string in database"
description: "Laravel: How to Safely Replace Strings in Your Database As a senior developer, I often encounter scenarios where we need to perform mass updates on data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As a senior developer, I often encounter scenarios where we need to perform mass updates on data based on string manipulation within the database. For example, when rebranding a website or changing product names across thousands of records, simple filtering using `LIKE` is just the first step; the real challenge lies in executing the actual replacement efficiently and safely at the database level.

You are facing a common problem: finding records that contain an old string and systematically replacing that string with a new one across the entire dataset. While Eloquent makes querying incredibly easy, performing complex, bulk data modifications often requires leveraging the power of raw SQL or specific database functions for maximum performance.

This guide will walk you through the developer-approved methods for tackling this string replacement task in a Laravel application.

---

## Why Simple `LIKE` Isn't Enough

You correctly identified that using `where('description', 'LIKE', '%old-brand-name%')` allows you to *find* the records. However, this method only retrieves the data; it does not modify the underlying data in the database itself. To achieve your goal—replacing the string—we need an operation that happens directly within the database engine.

Attempting to fetch every record, manipulate the string in PHP, and then save it back (the "fetch-modify-save" cycle) is highly inefficient, especially for large tables. The superior approach is to delegate the heavy lifting to the database itself using native update functions.

## Method 1: The Efficient Database Update (Recommended)

The most performant way to replace a substring in every matching row is by using SQL's built-in string replacement functions, such as `REPLACE()`. This avoids pulling potentially massive amounts of data into PHP memory just to update it.

Let's assume you want to change `'old-brand-name'` to `'new-brand-name'` within the `description` column of your `blog_posts` table.

### Using the `DB` Facade

You can execute this operation directly using Laravel's `DB` facade, which gives you direct access to the underlying SQL commands:

```php
use Illuminate\Support\Facades\DB;

$oldBrand = 'old-brand-name';
$newBrand = 'new-brand-name';

// Construct the raw SQL update statement using the REPLACE function
$updateSql = "UPDATE blog_posts SET description = REPLACE(description, ? , ?)";

// Execute the update. We use the where clause to ensure we only target relevant rows.
DB::update(
    $updateSql,
    [$oldBrand, $newBrand],
    [
        'description LIKE', 
        '%' . $oldBrand . '%', // Important: Use LIKE for targeting
    ]
);

echo "Successfully replaced all instances of '{$oldBrand}' with '{$newBrand}'.";
```

**Developer Insight:** Notice how we combined the `UPDATE` command with a conditional `WHERE` clause inside the parameters array. This ensures that the database only modifies rows where the original description actually contained the string we are searching for, making the operation atomic and highly efficient. For more complex WHERE clauses, you would combine this with your initial Eloquent query logic before executing the update.

## Method 2: Handling Complex Replacements (When `REPLACE` is Not Enough)

If your requirement is more complex—for instance, replacing substrings that span multiple columns or requiring conditional replacements based on other data—you might need to fall back to fetching the records and updating them using Eloquent, although this is slower.

For simple string replacement across a single field, however, sticking to **Method 1** is the gold standard. Remember, when building powerful applications with Laravel, understanding how to interact efficiently with the database layer is crucial. Frameworks like those found on https://laravelcompany.com provide excellent tools for managing data integrity and performance.

## Conclusion

When dealing with bulk string replacements in a Laravel application, always prioritize executing the logic at the database level whenever possible. Using native SQL functions like `REPLACE()` via the `DB` facade is significantly faster and more scalable than iterating through Eloquent models in PHP. This approach ensures data integrity while keeping your application fast and robust. Embrace the power of your database engine to handle heavy lifting!

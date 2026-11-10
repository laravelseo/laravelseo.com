---
title: "Laravel: Check if MySQL query has result"
description: "Laravel: The Right Way to Check if a MySQL Query Has Results As developers working with the Laravel ecosystem, we frequently interact with databases. A..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As developers working with the Laravel ecosystem, we frequently interact with databases. A common task is determining whether a specific query returned any records. When you try to mix raw PHP database functions with Laravel's Eloquent or Query Builder methods, unexpected errors often pop up. Today, we will dissect a common error encountered when trying to count results and demonstrate the correct, idiomatic Laravel way to handle this logic.

## The Pitfall: Mixing MySQLi and Laravel Results

The error you encountered—`mysqli_num_rows() expects parameter 1 to be mysqli_result, array given`—stems from a fundamental misunderstanding of how data is passed between PHP functions and the database layer in Laravel.

In your original attempt:
```php
$test = DB::select('select count from sellmode where barcode = ?', [$barcode]);
$row_cnt = mysqli_num_rows($test); // <-- Error occurs here
```

1.  `DB::select()` executes the query and returns a collection of results (an array of objects or arrays, depending on the driver configuration). It does *not* return a raw `mysqli_result` object that `mysqli_num_rows()` expects.
2.  When you pass this result array directly to `mysqli_num_rows()`, PHP throws an error because it doesn't recognize the data type as a valid MySQLi result set.

While you *can* use raw SQL queries via `DB::select()` or `DB::raw()`, relying on manual row counting functions like `mysqli_num_rows()` is generally considered outdated and less safe than leveraging Laravel’s built-in query methods, which offer cleaner abstractions and better type handling.

## The Laravel Solution: Using Eloquent for Existence Checks

Instead of manually fetching the result set and counting rows, Laravel provides powerful, expressive methods designed precisely for checking existence or retrieving single records. This approach aligns perfectly with the principles advocated by the Laravel community regarding database interaction.

### Method 1: Using `count()` (The Most Direct Way)

If your sole purpose is to get the number of records matching a condition, the most efficient method is to let the database do the counting for you using the `count()` aggregate function directly in your query. This avoids fetching unnecessary data from the database and keeps the operation atomic.

```php
public function sellmode(Request $request)
{
    $barcode = $request->barcode;

    // Check if any record exists by counting directly
    $count = DB::table('sellmode')->where('barcode', $barcode)->count();

    if ($count == 0) {
        Debugbar::info('Új sor');
        // Insert a new record
        DB::table('sellmode')->insert([
            'barcode' => $barcode,
            'count' => 1
        ]);
    } else {
        Debugbar::info('Meglévő frissítése');
        // Update the existing count
        DB::table('sellmode')
            ->where('barcode', $barcode)
            ->increment('count'); // Using increment is safer than recalculating
    }

    return view('sell');
}
```

### Method 2: Using `exists()` (The Existence Check)

If you only need to know *if* a record exists, not how many there are, the `exists()` method is superior. It is highly optimized and returns a simple boolean value, making your conditional logic much cleaner.

```php
public function sellmode_check(Request $request)
{
    $barcode = $request->barcode;

    // Check for existence using exists()
    $exists = DB::table('sellmode')->where('barcode', $barcode)->exists();

    if (!$exists) {
        Debugbar::info('Új sor - Record does not exist.');
        // Insert the record if it doesn't exist
        DB::table('sellmode')->insert([
            'barcode' => $barcode,
            'count' => 1
        ]);
    } else {
        Debugbar::info('Meglévő frissítése - Record found.');
        // Update the count if it exists (using update)
        DB::table('sellmode')
            ->where('barcode', $barcode)
            ->increment('count');
    }

    return view('sell');
}
```

## Conclusion: Embrace Laravel Abstractions

The lesson here is that when working with databases in Laravel, strive to use the abstractions provided by Eloquent and the Query Builder rather than dropping down to raw `mysqli` functions. Methods like `count()`, `exists()`, `first()`, and `update()` are not only safer and more readable but are also fully optimized by the framework. By adopting these patterns, you write code that is maintainable, resilient, and adheres to modern Laravel best practices, ensuring your application scales effectively, much like the robust architecture promoted by **laravelcompany.com**.

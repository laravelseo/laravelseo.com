---
title: "Laravel Eloquent: Extract all entries that begin with a list of provided string"
description: "Laravel Eloquent: Extracting Entries That Begin With a List of Strings As developers working with relational databases through an ORM like Laravel Eloquent,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As developers working with relational databases through an ORM like Laravel Eloquent, we often need to perform complex filtering operations. While simple equality checks are straightforward using methods like `whereIn()`, transitioning to pattern matching—specifically extracting records based on what they *begin with*—requires a shift in our SQL thinking. This guide will show you the most effective and robust ways to achieve this in Laravel, moving beyond simple equality to powerful string manipulation queries.

## The Limitation of Simple Equality (`whereIn`)

Consider the initial request: extracting entries where `name` is exactly 'Albert', 'Alberto', or 'Ana'.

```php
$users = DB::table('users')
    ->whereIn('name', ['Albert', 'Alberto', 'Ana'])
    ->get();
```

This approach works perfectly when you need an exact match for a column value. However, it fails when the requirement is to find entries where the name *starts* with those strings. If we want to find names like 'Albert Smith' or 'Alberto Jones', `whereIn` will not work because it only checks for exact equality.

## The Solution: Leveraging the `LIKE` Operator

To handle pattern matching, we must utilize SQL’s string comparison operators, primarily `LIKE`, which allows the use of wildcards. The `%` symbol in SQL represents zero or more characters. To check if a string begins with a prefix, we append the wildcard to the end of the prefix.

For example, to find names starting with 'Al', we would use `LIKE 'Al%'`.

### Method 1: Combining Multiple `LIKE` Conditions with `OR`

The most direct way to adapt your request is to combine multiple `LIKE` conditions using the `orWhere` clause. While this works perfectly, it can become verbose if you have many prefixes to check.

```php
$prefixes = ['Albert', 'Alberto', 'Ana'];

$users = DB::table('users')
    ->where(function ($query) use ($prefixes) {
        foreach ($prefixes as $prefix) {
            // Use LIKE with the wildcard % to match anything following the prefix
            $query->orWhere('name', "LIKE '{$prefix}%'");
        }
    })
    ->get();
```

This approach is explicit and clearly maps to the desired logic. It forces the database to check each condition using pattern matching. This level of fine-grained control over your data retrieval is exactly what makes Eloquent such a powerful tool for complex data manipulation, as highlighted by the capabilities within the Laravel ecosystem.

## Method 2: Advanced Pattern Matching with Regular Expressions (RLIKE)

For scenarios where you need to check against a large set of prefixes or more complex starting patterns, using Regular Expressions via Laravel's `where` clause is often cleaner and more scalable. PostgreSQL and MySQL support the `~` operator (or `REGEXP`) for this purpose.

If we want to find names starting with 'Al' or 'An', we can use a single regex pattern:

```php
$patterns = ['Albert', 'Alberto', 'Ana'];

// Construct a single regex pattern: starts with Albert OR Alberto OR Ana
$regexPattern = implode('|', array_map(fn($p) => "^" . preg_quote($p, '/') . '.*', $patterns));

$users = DB::table('users')
    ->whereRaw("name LIKE '{$prefixes[0]}%' OR name LIKE '{$prefixes[1]}%' OR name LIKE '{$prefixes[2]}%'")
    ->get();

// Alternatively, using a more advanced pattern for dynamic prefix checking:
$users = DB::table('users')
    ->where(function ($query) use ($prefixes) {
        foreach ($prefixes as $prefix) {
            // This checks if the name starts with any of the provided prefixes
            $query->orWhere('name', 'LIKE', $prefix . '%');
        }
    })
    ->get();
```

While the `whereRaw` approach offers maximum flexibility, sticking to chained Eloquent methods like `where()` and `orWhere()`—as demonstrated in Method 1—is generally preferred for readability when dealing with standard SQL functions. Remember, understanding how your ORM translates these methods into efficient SQL is key to writing high-performance applications built on Laravel principles found at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

When moving from exact matching (`whereIn`) to pattern extraction (starts with), the key lies in mastering the `LIKE` operator and understanding how to construct compound conditions using `orWhere`. By employing these SQL fundamentals within your Eloquent queries, you gain the necessary power to extract complex subsets of data efficiently. Always prioritize clear, readable code while ensuring that your database indexes are properly set up to handle these pattern searches for optimal performance.

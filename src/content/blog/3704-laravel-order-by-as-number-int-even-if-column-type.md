---
title: "Laravel - Order by as Number (int), even if column type is string"
description: "Laravel: Ordering by Numbers Stored as Strings – The Developer's Guide As a senior developer working with Laravel and relational databases, we constantly..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As a senior developer working with Laravel and relational databases, we constantly encounter scenarios where the data stored in our database doesn't perfectly align with the mathematical reality we intend to use for sorting or calculations. One common issue arises when a column is defined as a `string` (or `varchar`) but contains purely numeric values—such as section numbers ('1', '2', '10')—and standard alphabetical sorting yields incorrect results.

The provided example highlights this exact challenge:

```php
$query = Section::orderBy("section", "desc")->get();
```

If the `section` column is a string, the database performs a lexicographical (alphabetical) sort. This means '10' comes before '2' because '1' comes before '2'. To achieve true numerical sorting, we must explicitly tell the database to treat those strings as integers during the sorting process.

This guide will walk you through the correct, robust ways to handle ordering numeric data stored in string columns within a Laravel application.

## Why Standard Sorting Fails

When SQL sorts strings, it compares character by character from left to right. Consider these values being sorted descendingly:
*   '10'
*   '2'
*   '5'

Alphabetically (lexicographically), the order is: '5', '2', '10'. This is incorrect numerically. To get the correct numerical order ('10', '5', '2'), we need to force the database to interpret those strings as actual numbers before comparison.

## Solution 1: The Database Level Approach (Recommended)

The most efficient and robust solution is to ensure the data type in your database schema reflects its true nature. If a column *must* be numeric, it should be an `INT` or `BIGINT`. This allows the database engine to handle numerical sorting natively and efficiently.

If you cannot change the schema immediately (perhaps due to legacy constraints), you can force the casting within your query using raw SQL expressions provided by Laravel's Query Builder.

### Using `orderByRaw` for Explicit Casting

The `orderByRaw` method allows you to inject raw SQL directly into your query. We can use the `CAST` function (or equivalent database-specific functions) to convert the string column to an integer during the sorting operation.

For MySQL and PostgreSQL, this approach is highly effective:

```php
use Illuminate\Support\Facades\DB;

$query = Section::orderBy(DB::raw('CAST(section AS SIGNED)'), 'desc')->get();

// Or for PostgreSQL:
// $query = Section::orderBy(DB::raw('section::integer'), 'desc')->get();
```

**Explanation:**
By wrapping the column name in a `DB::raw()` expression, we instruct the database engine to evaluate the expression rather than treating it as a literal string. We explicitly cast the `section` column to an integer (`SIGNED` or `integer`) before applying the descending order. This guarantees correct numerical sorting regardless of how the data was stored initially.

## Solution 2: Application Level Casting (Eloquent Model)

If you intend for this field to *always* be treated as a number within your Laravel application logic—for calculations, filtering, and model access—you should implement Eloquent casting in your `Section` model. This ensures that whenever you retrieve the data, it is already an integer type in PHP, simplifying subsequent operations.

In your `app/Models/Section.php` file:

```php
protected $casts = [
    'section' => 'integer', // or 'int'
];
```

When using this approach, you can revert to the simpler syntax for ordering, as Eloquent handles the necessary conversions internally when working with typed attributes:

```php
// Now, because of the model casting, Eloquent often optimizes this internally.
$query = Section::orderBy('section', 'desc')->get();
```

While this method is cleaner for application logic, remember that **database-level casting (Solution 1)** remains the most performant way to handle large datasets, as it pushes the heavy lifting down to the database engine itself.

## Conclusion

When dealing with data that spans both string representation and numeric intent in Laravel, the key is to choose the right level of intervention. For performance and data integrity, always strive to store numeric data as native integers in your database schema. If you must sort strings numerically, leverage `DB::raw()` and explicit casting within your query, as demonstrated with `orderByRaw`. By mastering these techniques, you ensure that your Laravel applications deliver accurate and reliable results. For more deep dives into optimizing database interactions in Laravel, exploring resources from [https://laravelcompany.com](https://laravelcompany.com) is highly recommended.

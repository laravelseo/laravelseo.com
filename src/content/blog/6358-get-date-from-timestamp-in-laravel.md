---
title: "Get date from timestamp in laravel"
description: "Mastering Date Extraction in Laravel: Getting Dates from Timestamps with the Query Builder As developers working with relational databases through an ORM..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with relational databases through an ORM like Laravel, understanding how to translate raw SQL functions into Eloquent or Query Builder methods is crucial. Many developers run into confusion when trying to use database-specific functions like `DATE()` directly within the query builder syntax. This post will walk you through the correct, robust way to extract the date portion from a timestamp column in Laravel, addressing the exact scenario you presented.

## The SQL vs. Eloquent Divide: Understanding the Challenge

You are correct in noting that standard SQL allows you to easily extract just the date part using functions like `DATE('timestamp_column')`.

**Normal Query:**
```sql
SELECT DATE('2015-07-31 06:03:21'), customer_id FROM customer_histories;
```

The challenge arises when migrating this logic into the Laravel Query Builder. Simply passing a string like `DATE(created_at)` inside an array for `select()`—as you attempted—does not work because the Query Builder expects column names or simple expressions, not complex SQL function calls.

**Incorrect Attempt:**
```php
$customerhistory = Customerhistory::where('customer_id', 1)
    ->select('freetext', 'DATE(created_at)') // This syntax is invalid for raw functions in select()
    ->get();
```
This fails because the Query Builder attempts to interpret `DATE(created_at)` as a literal column name, not an instruction to execute a database function on that column.

## The Solution: Leveraging `DB::raw()` for Database Functions

To bridge the gap between standard SQL functions and the Laravel Query Builder, you must use the `DB::raw()` method. This method allows you to inject arbitrary, raw SQL expressions directly into your query. This is the standard practice when performing operations that rely on specific database functions, such as extracting dates, manipulating strings, or applying complex calculations.

Here is how you correctly get the date from a timestamp column in Laravel:

```php
use Illuminate\Support\Facades\DB;
use App\Models\Customerhistory; // Assuming your model namespace

// Retrieve data using DB::raw() to apply the DATE function
$customerhistory = Customerhistory::where('customer_id', 1)
    ->select(
        'freetext',
        DB::raw('DATE(created_at) as created_date') // Use DB::raw() here
    )
    ->get();

// Output example:
// The resulting collection will contain records where the 'created_date' column 
// holds only the date part (e.g., '2015-07-31').
```

### Best Practice: Aliasing the Result

Notice that we used `DB::raw('DATE(created_at) as created_date')`. It is highly recommended to use an alias (`as created_date`) when using `DB::raw()`. This gives your result a clean, meaningful column name in the final result set, making it much easier to work with in subsequent PHP logic or when mapping to Eloquent models.

## Alternative: Post-Processing with Carbon

While using `DB::raw()` is perfect if you need the date *in the database query*, sometimes the best practice involves letting the database return the full timestamp and handling the formatting within your application layer using **Carbon**. This approach can be more flexible, especially if you plan to perform complex date comparisons or timezone adjustments later on.

If you select the full `created_at` timestamp:

```php
$customerhistory = Customerhistory::where('customer_id', 1)
    ->select('freetext', 'created_at')
    ->get();

foreach ($customerhistory as $record) {
    // Use Carbon to format the full timestamp into a desired date string
    $formattedDate = \Carbon\Carbon::parse($record->created_at)->toDateString();
    
    echo "Free Text: " . $record->freetext . ", Date Only: " . $formattedDate . "\n";
}
```

This method separates the data retrieval (database responsibility) from the data presentation and manipulation (application responsibility), which is a core principle of clean application architecture, aligning with best practices taught by developers at **https://laravelcompany.com**.

## Conclusion

To summarize, when interacting with database functions within the Laravel Query Builder, avoid trying to use standard array syntax for complex SQL operations. Instead, utilize `DB::raw()` to safely inject raw SQL expressions like `DATE(column_name)`. For simple date extractions, this is the most direct and efficient path. If you need more sophisticated date manipulation in your application logic, integrating powerful libraries like Carbon provides an excellent layer of control over your timestamp data.

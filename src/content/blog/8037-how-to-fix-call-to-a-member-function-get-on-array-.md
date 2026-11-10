---
title: "How to fix \"Call to a member function get() on array\" : Laravel 5.4"
description: "How to Fix \"Call to a member function get() on array\" when Exporting Data in Laravel Dealing with database queries and file exports in Laravel often involves..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

Dealing with database queries and file exports in Laravel often involves navigating subtle pitfalls related to how the underlying PHP data structures are handled. One common, frustrating error that developers encounter, especially when using packages like `maatwebsite/laravel-excel`, is the dreaded: **`Call to a member function get() on array`**.

This post will dive deep into why this error occurs specifically when using raw database queries with aliases and how you can correctly structure your data to ensure smooth file generation.

---

## Understanding the Error in Context

The error `Call to a member function get() on array` signifies that your code is attempting to call a method named `get()` on a variable that holds a standard PHP array, rather than an object that possesses a `get()` method (like a Model instance or a Collection).

In the context of your provided code snippet, the issue stems from how you are combining `DB::select()` with subsequent operations intended for Excel export.

```php
$temp = DB::select(DB::raw("select regionalid, nvl(sum(case when lastactiontype='0' then totalcharge end),0) as creditlimit_usage, count(case when lastactiontype='0' then msisdn end) as creditlimit_rec, from alarms_v2 where alarmdate = '$today' group by regionalid order by regionalid"))->get();
```

When you use `DB::select()`, it returns a `stdClass` object (or an array of objects, depending on the driver and context). When you chain `->get()`, you are attempting to retrieve the results as a standard PHP array. However, if the subsequent logic or the Excel package expects a specific structure from this result set, misinterpreting the data type can lead to this failure.

The core problem is often that the data returned by raw SQL functions (especially those involving aggregation like `SUM` and `COUNT`) needs careful handling before being passed to array-based exporters.

## The Correct Approach: Handling Raw Query Results

When exporting data using packages like `maatwebsite/laravel-excel`, the package expects a simple, flat, two-dimensional array of data—an array where each inner element is a row. We need to ensure that the result from the database query is perfectly formatted for this expectation.

The fix involves ensuring that you correctly extract and format the results from your `DB::select()` call before passing them to the Excel builder.

### Solution Implementation

Instead of relying on chaining methods in a potentially ambiguous way, let's explicitly handle the raw result set. The most robust way is to ensure we are working directly with the array returned by the query execution.

Here is how you can refactor your function to safely handle the complex aggregated data:

```php
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

public function getdoc($type)
{
    $today = "20181008";

    // 1. Execute the raw query and retrieve the results directly as an array
    $results = DB::select(DB::raw("
        select regionalid,
               nvl(sum(case when lastactiontype='0' then totalcharge end),0) as creditlimit_usage, 
               count(case when lastactiontype='0' then msisdn end) as creditlimit_rec
        from alarms_v2
        where alarmdate = ? -- Use binding for safety instead of string interpolation
        group by regionalid
    "), [$today]); // Pass parameters safely

    // 2. Now, $results is a clean array of standard objects/arrays, ready for export
    return Excel::create('datadoc', function ($excel) use ($results) {
        $excel->sheet('mySheet', function ($sheet) use ($results) {
            // Use fromArray directly on the clean result set
            $sheet->fromArray($results); 
        });
    })->download($type);
}
```

### Why This Works Better

1.  **Explicit Result Handling:** By capturing the output of `DB::select()` into a variable (`$results`) and using it directly, you ensure that the data structure passed to `fromArray()` is exactly what the Excel package expects—a standard PHP array containing the row data.
2.  **Safety with Binding:** I have also updated the query to use parameter binding (`?` placeholder and passing `$today` as an array argument). This is a crucial best practice, especially when dealing with raw SQL, preventing potential SQL injection vulnerabilities. As noted by the team at [Laravel Company](https://laravelcompany.com), secure database interaction is fundamental to building reliable applications.
3.  **Clarity:** This separation makes your code much easier to debug and maintain compared to complex chained calls that rely on implicit object behavior.

## Beyond Raw Queries: Eloquent Best Practices

While the fix above solves the immediate error with raw queries, as a senior developer, I strongly recommend exploring alternatives for data retrieval whenever possible. Relying heavily on `DB::select()` with complex aggregations, while powerful, can become cumbersome and error-prone.

For standard CRUD operations and even many reporting tasks, leveraging Laravel's **Eloquent ORM** is generally cleaner and safer. When dealing with relationships or complex calculations, Eloquent allows you to manage the data hydration automatically. If your data structure permits it, fetching results through Eloquent models often simplifies the process significantly, reducing the chance of these kinds of array-related errors.

## Conclusion

The error "Call to a member function get() on array" is a symptom of mismatched expectations between the raw database output and the methods expecting structured objects. By explicitly capturing the result from `DB::select()` and ensuring it is passed as a clean, flat array to your export library, you resolve this issue immediately. Always prioritize explicit data handling when working with raw SQL results in Laravel projects. Happy coding!

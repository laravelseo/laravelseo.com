---
title: "Rappasoft Laravel Livewire Datatables, Job table with a column that count work items and should be sortable"
description: "Rappasoft Livewire Datatables: Sorting Calculated Columns in Laravel Eloquent As a senior developer, I often encounter situations where we use powerful..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I often encounter situations where we use powerful front-end libraries like DataTables, combined with elegant back-end tools like Livewire and packages such as `rappasoft/laravel-livewire-datatables` to present complex data. While these tools simplify rendering, they sometimes expose underlying SQL challenges related to sorting and computed columns.

Today, I want to address a very common hurdle: how to create a sortable column based on a calculated relationship count in a Laravel application using this specific Livewire table package.

## The Challenge: Sorting Calculated Data

I recently worked with a scenario where I was displaying a list of Jobs. I wanted to add a column labeled "Work Items" (WI) that displayed the count of associated `JobWorkItem` records for each job. Since this is a metric, sorting by it should be intuitive.

My initial approach involved calculating this count directly within the `builder()` method using a correlated subquery:

```php
// Original attempt structure
return Job::query()
    ->select(['*', DB::raw('(SELECT COUNT(*) FROM job_work_items WHERE job_number = jobs.number) as wi_count')])
    // ... rest of the query
```

While this successfully populated the data for display, when I attempted to sort the resulting table by the `wi_count` column, the database returned an error: `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'jobs.w_i' in 'field list'`.

This error occurs because while you successfully selected the calculated value (`wi_count`) into the result set, the sorting mechanism often expects a direct column reference that is natively recognized by the underlying query structure or Eloquent model fields. The dynamic nature of the correlated subquery, when referenced for sorting in this specific package setup, caused the failure.

## The Solution: Optimizing the Query for Sorting

The key to resolving this lies in restructuring how we fetch and present the data. Instead of relying on a correlated subquery inside the `select()` statement for sorting purposes, we should leverage Eloquent relationships and appropriate aggregation methods to ensure the database structure is optimized for sorting operations.

For complex reporting where sorting by related counts is essential, performing an explicit `LEFT JOIN` and then grouping the results allows the database engine to handle the sorting much more efficiently and reliably. This approach aligns perfectly with best practices in Laravel development, as we aim for clean, efficient data retrieval, mirroring how robust solutions like those promoted by [laravelcompany.com](https://laravelcompany.com) are designed.

### Implementing the Correct Approach

We will modify the `builder()` method to explicitly join the related table and use aggregation functions to calculate the count directly on the main query level.

Here is the revised implementation for your Livewire component:

```php
use App\Models\Job;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class All extends DataTableComponent
{
    // ... other properties

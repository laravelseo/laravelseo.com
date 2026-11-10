---
title: "Laravel Eloquent OR WHERE IS NOT NULL"
description: "Title: Laravel Eloquent OR WHERE IS NOT NULL: A Comprehensive Guide Body: Laravel Administrator packages like FrozenNode's can be a great way to manage your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Laravel Eloquent OR WHERE IS NOT NULL: A Comprehensive Guide

Body:
<p>Laravel Administrator packages like FrozenNode's can be a great way to manage your application's data, including soft-deleted records. However, sometimes while trying to display all results - both deleted and non-deleted - you may encounter issues with displaying results from soft-deleted records using Laravel Eloquent ORM. In this blog post, we will explore how to fix the problem of displaying soft-deleted records from your database by overriding the default query using a combination of Laravel's Eloquent ORM and raw SQL.</p>

<p>To begin with, let us understand why the original approach might not have worked as expected. The query you were trying to use: "select * from `scripts` where `scripts`.`deleted_at` is null or `scripts`.`deleted_at` is not null group by `scripts`.`id`" can be broken down into two conditions - either the deleted_at column must have a null value, or it does not. The issue arises when you add '**is null**' in your query, which doesn't make sense since 'null' means this field has no value, while 'not null' is the opposite.</p>

<p>A more accurate approach could be: "select * from `scripts` where (`scripts`.`deleted_at` = NULL) or (`scripts`.`deleted_at` <> NULL) group by `scripts`.`id`" This query uses different comparison operators - '=' for checking if a field is null, and '<>' for checking if it's not null. By using this approach, you are making sure that either the deleted_at column has no value or it doesn't. This ensures that your script records will be listed without errors.</p>

<p>To implement this solution in Laravel Eloquent ORM, let us use a custom query scope to filter out soft-deleted and non-soft-deleted records. The code would look like this:</p>

<pre><code>class Script extends Model {
  public function scopeWithDeletedOrNonDeleted($query) {
    return $query->where(function ($q) {
      $q->orWhere('scripts.deleted_at', null);
      $q->orWhere('scripts.deleted_at', '!=', null);
    })
    ->groupBy('scripts.id');
  }
}
</code></pre>

<p>Here, we are creating a new scope named 'withDeletedOrNonDeleted' within the Script model class. In this scope, we are using two different conditions to check if the deleted_at column is null or not null. We also use groupBy to ensure that each unique ID is displayed only once in our result.</p>

<p>In conclusion, overriding default queries and implementing custom query scopes can help you effectively display both soft-deleted and non-soft-deleted records using Laravel Eloquent ORM. By understanding the difference between 'is null' and 'not null' in SQL comparisons and adopting best practices in your code, you can resolve issues with displaying soft-deleted records successfully. Remember to keep your queries accurate and structured for better performance and maintainability of your application.</p>

<p><strong>Note:</strong> Always ensure that your query logic is well-tested before applying it to your production database. Test on a development environment or use a staging server to verify the results before making any changes in live environments.</p>

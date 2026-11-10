---
title: "Laravel 6.0 Eloquent - sort by date and status"
description: "Title: Laravel 6.0 Eloquent Effective Sorting by Date and Status for Multiple Columns Introduction: In Laravel applications, ordering table data based on..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Laravel 6.0 Eloquent - Effective Sorting by Date and Status for Multiple Columns

Introduction: In Laravel applications, ordering table data based on multiple columns is a common developer requirement. In this article, we will discuss the efficient way to sort your tables according to both date created and status values using Laravel 6.0 Eloquent. We'll also present a comprehensive example that can be easily adapted for various use cases, ensuring clean and readable code.

Body:

The first important concept here is understanding how Laravel's sortByDesc() function works. It takes an array of column keys as arguments, sorts them in descending order, and returns the sorted collection. In case where you need to apply multiple conditions on your data, you can use chained methods. Here are the steps:

1. Eager-load all the related records from the database using an eager-loading relationship. This will ensure that any associated models (like Status) are loaded along with the initial query. For instance, if you have a model named 'Inquiry' and it has one to many relation to status, you would do:
   <pre><code>$inquiries = Inquiry::with('status')->get();</code></pre>

2. Sort the eager-loaded collection by date created in descending order with the given sortByDesc() method call:
   <pre><code>$inquiries = $inquiries->sortByDesc('created_at');</code></pre>

3. Next, you need to order them according to status, specifically for the ones having status as 'New', also in descending order. You can use Laravel's sortBy() function with an anonymous function for this task:
   <pre><code>$newInquiries = $inquiries->sort(function ($a, $b) {
    if (($a->status && !$b->status) || (!$a->status && $b->status)) return 1; // Place new inquiries first
    else if ($a->status == 'New' && $b->status != 'New') return -1; // Put new inquiries last among non-new statuses
    else return 0; // Keep others sorted by their statuses
});</code></pre>

4. Finally, merge the original eager-loaded collection with the sorted array containing only new inquiries:
   <pre><code>$inquiries = $inquiries->merge($newInquiries);</code></pre>

5. For your final result, use Laravel's values() method to return all items as an array:
   <pre><code>$orderedList = $inquiries->values();</code></pre>

Conclusion: In this comprehensive guide, we have explored how to efficiently order a table in Laravel 6.0 Eloquent based on multiple columns. By understanding the sortByDesc() and sortBy() functions and their applications, you can create effective code that sorts your data as per requirements. Remember to use meaningful variable names for better readability and maintainability of your application's codebase. Always strive for optimized solutions and adapt these techniques to cater to various specific needs.

Natural backlinks: https://laravelcompany.com/blog/laravel-eloquent-sorting-by-date-and-status-using-l60

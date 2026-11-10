---
title: "Get number of rows in Laravel's Eloquent before using \"take\" and \"skip\""
description: "Getting the Total Row Count in Laravel Eloquent Before Using take() and skip() As developers working with large datasets, pagination is an essential..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As developers working with large datasets, pagination is an essential tool. When building interfaces that display data in chunks (like search results or administrative lists), using methods like `take()` and `skip()` is standard practice. However, a common pitfall arises when you need to display meaningful information to the user, such as "Showing 11 of 50 results," which requires knowing the total number of records available *before* limiting the output.

The challenge we face is accurately determining the total count that matches our complex `where` clauses before we apply the pagination limits. If we simply call `count()` after applying `take()` and `skip()`, the result will only reflect the limited set, not the true total.

This post will dive into the most efficient and idiomatic way to retrieve the total number of records in an Eloquent query *before* applying pagination offsets, ensuring both accuracy and performance.

## The Problem with Post-Pagination Counting

Let's examine the scenario you described: filtering contacts by first and last name, and then applying `take()` and `skip()`.

If you count the results *after* applying these methods, you are inherently counting only the subset of data requested.

```php
$contacts = Contact::where(function($query) use ($request) {
    // ... where clauses for firstname and lastname ...
})
->take($iDisplayLength)
->skip($iDisplayStart)
->get(); // $contacts now only has the displayed subset

$iTotalRecords = count($contacts); // This will return $iDisplayLength - $iDisplayStart, not the total!
```

As you correctly observed in your thought process, attempting to calculate the total by running a separate query or manipulating the results after the fact is inefficient and messy. We need the total count *from the database* before any row reduction happens.

## The Solution: Counting Before Pagination

The solution lies in executing the `count()` operation on the base query builder instance *before* applying the `take()` and `skip()` methods. This ensures that the count reflects all records matching the initial filtering criteria, regardless of what pagination limits are applied later.

This approach leverages Eloquent's ability to build a raw SQL aggregate query efficiently. The database engine handles the counting operation separately from the row retrieval process, making it highly performant.

Here is how you implement this pattern correctly:

```php
$query = Contact::where(function($query) use ($request) {
    if (!empty($request['firstname'])) {
        $query->where('firstname', 'LIKE', "%{$request['firstname']}%");
    }   
    if (!empty($request['lastname'])) {
        $query->where('lastname', 'LIKE', "%{$request['lastname']}%");
    }     
});

// STEP 1: Get the total count immediately after applying filters.
$iTotalRecords = $query->count(); 

// STEP 2: Apply pagination (take/skip) and retrieve the results.
$contacts = $query->take($iDisplayLength)->skip($iDisplayStart)->get();
```

By executing `$query->count()` immediately after defining your `where` constraints, we instruct the database to calculate the total number of matching rows based on those filters *before* it has to fetch and limit the actual data. This results in a single, highly optimized query for counting, followed by a separate, limited query for fetching the data—a significant performance improvement over running two full queries.

## Best Practices for Eloquent Performance

When dealing with large tables, understanding how Eloquent interacts with the database is crucial for scaling your application. Whenever you need counts or summarized information before pagination:

1.  **Prioritize `count()`:** Always use the model's `count()` method on the query builder object to get the total number of records matching your criteria.
2.  **Use `paginate()` (When Appropriate):** For most standard UI needs, leveraging Laravel's built-in `paginate()` method is often cleaner than manually managing `take()` and `skip()`. The `paginate()` method automatically handles retrieving the total count for you, making the code more readable and less error-prone.
3.  **Indexing is Key:** Ensure that any columns used in your `where` clauses (like `firstname` or `lastname` in our example) are properly indexed in your database. This dramatically speeds up both the filtering (`where`) and the counting (`count()`) operations, which is essential for handling large datasets efficiently.

By correctly separating the counting step from the retrieval step using the query builder methods, you ensure that your application remains fast, accurate, and scalable, adhering to the high standards set by frameworks like Laravel. For more in-depth knowledge on Eloquent relationships and performance tuning, exploring resources on [laravelcompany.com](https://laravelcompany.com) is highly recommended.

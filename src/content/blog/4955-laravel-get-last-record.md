---
title: "laravel - get last record"
description: "Mastering the \"Last Record\": How to Retrieve the Latest Entry in Laravel Eloquent As developers working with relational databases through an ORM like Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with relational databases through an ORM like Laravel Eloquent, we constantly face scenarios where fetching data isn't just about retrieving *any* record; it’s about retrieving the most recent one. The query you presented—`$user->orders->where('service_id', $request->service_id)->first()`—is perfectly valid for getting *a* record, but it inherently relies on the database's default ordering, which is often arbitrary unless a timestamp exists.

When we need the **last** or **most recent** item, and we lack a standard `created_at` column (perhaps due to legacy systems or specific database constraints), we need a robust strategy that bypasses reliance on timestamps and leverages the inherent structure of your data.

This post will guide you through the most effective, developer-centric ways to reliably fetch the latest record from a relationship in Laravel, even without a dedicated timestamp field.

---

## The Pitfall of `first()` When Seeking "Last"

When you use Eloquent methods like `first()`, they simply retrieve the first matching row returned by the database engine based on its internal sorting (or lack thereof). If your table has no explicit ordering mechanism defined for time, there is no guarantee that `first()` will return the record inserted most recently. It's an unreliable approach when temporal relevance is key.

To reliably get the "last" record, we must explicitly instruct the database on *how* to define "last." In almost all modern relational databases (MySQL, PostgreSQL), the standard way to determine the latest entry is by sorting based on an auto-incrementing primary key (`id`) in descending order and taking only the first result.

## Solution 1: Leveraging Primary Keys for Recency

The most robust solution when timestamps are unavailable is to rely on the primary key, assuming it follows sequential insertion order. This method works reliably across most SQL implementations.

To get the latest order for a specific service ID, you should modify your query to sort by the primary key descending and limit the result to one:

```php
$latestOrder = $user->orders()
    ->where('service_id', $request->service_id)
    ->orderBy('id', 'desc') // Sort by the primary key in descending order
    ->first();             // Take only the very first (i.e., the latest) one
```

### Why This Works:

1.  **`orderBy('id', 'desc')`**: This tells the database to arrange all matching orders so that the record with the highest `id` (the newest insertion, assuming standard auto-incrementing behavior) appears at the top.
2.  **`first()`**: By requesting the first result after sorting descendingly, you isolate exactly the most recently created order.

This technique is a cornerstone of efficient data retrieval in Laravel and aligns perfectly with best practices discussed on platforms like [laravelcompany.com](https://laravelcompany.com). Understanding how Eloquent translates these methods into raw SQL is crucial for advanced database interaction.

## Solution 2: Handling Complex Relationships (Eager Loading)

If you are dealing with a deeply nested relationship and need to ensure the parent model fetching the data is also correct, you can apply this logic directly to the relationship query itself before loading it onto the Eloquent model.

For instance, if you were querying all orders for a user:

```php
$recentOrders = $user->orders()
    ->orderBy('id', 'desc')
    ->take(1) // Alternative way to limit to one record
    ->get();
```

This ensures that the collection loaded into `$recentOrders` contains only the single, most recent order. This approach keeps your data retrieval clean and delegates the sorting logic directly to the database, which is significantly more performant than fetching potentially thousands of records and sorting them in PHP memory.

## Conclusion: Prioritize Explicit Ordering

When working with Eloquent and relational databases, never assume default ordering will suffice for temporal queries. If you need the "last" or "latest" record, always be explicit. By mastering the combination of `orderBy('id', 'desc')` and `first()`, you gain complete control over your data retrieval, ensuring accuracy and performance regardless of whether standard timestamp columns are present. This practice elevates your code from functional to truly robust.
